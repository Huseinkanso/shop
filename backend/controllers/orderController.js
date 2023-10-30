import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import dotenv from 'dotenv'
dotenv.config()
import {Stripe} from 'stripe'
const stripePayment=new Stripe(process.env.STRIPE_SECRET_KEY)

// desc    create order
// route   post /api/orders
// private  Public
const addOrderItems = asyncHandler(async (req, res) => {
    const {orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice} = req.body

    if(orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No order items')
    } else {
        const order = new Order({
            orderItems: orderItems.map(item => ({...item, product: item._id})), 
            user: req.user._id,
            shippingAddress, 
            paymentMethod, 
            itemsPrice, 
            taxPrice, 
            shippingPrice, 
            totalPrice
        })

        const createdOrder = await order.save()
        console.log('created order  ' + createdOrder);
        res.status(201).json(createdOrder)
    }
})
// get logged in user orders
// route   get /api/orders/myorders
// private  
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({user: req.user._id})
    res.status(200).json(orders)
})

// get order by id
// route   get /api/orders/:id
// private
const getOrderById = asyncHandler(async (req, res) => {
    // populate does the same as join in sql and get name email like eager loading in entity framework
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if(order) {
        res.status(200).json(order)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})
// wenhook for stripe to update order to paid
// route   put /api/orders/pay
// public
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event = req.body ;
  // try {
  //   event = stripePayment.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  // } catch (err) {
  //   throw new Error(`Webhook Error: ${err.message}`);
  // }
  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const order_id = session.metadata.order_id;
    const order = await Order.findById(order_id)
    if(order)
    {
      console.log(session);
      const email= session.customer_details.email;
      const {id,status}= session;
      if(order)
      {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
          id: id,
          status: status,
          update_time: Date.now(),
          email_address: email 
        }
        const updatedOrder = await order.save()
        console.log(updatedOrder);
      }
    }
  }
})

// update order to delivered
// route   put /api/orders/:id/deliver
// private/admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order=await Order.findById(req.params.id);
    if(order)
    {
        order.isDelivered = true
        order.deliveredAt = Date.now()
        const updatedOrder = await order.save()
        res.status(200).json(updatedOrder)
    }else{
        res.status(404)
        throw new Error('Order not found')
    }
})

// get all orders
// route   get /api/orders
// private/admin
const getOrders = asyncHandler(async (req, res) => {
    const orders= await Order.find({}).populate('user','id name')
    res.status(200).json(orders)
})

// pay with stripe
// route   post /api/orders/create-checkout-session
// private
const payWithStripe = asyncHandler(async (req, res) => {
    const {orderId}=req.body
    const order = await Order.findById(orderId)
    if(order)
    {
        const session = await stripePayment.checkout.sessions.create({
            mode: 'payment',
            line_items:[ {
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: 'Now You can Pay out what you ordered from Electro shop',
                    images: ['https://i.ibb.co/0s3pdnc/Logo.png'],
                  },
                  unit_amount: Math.round(order.totalPrice * 100),
                },
                quantity: 1,
              }],
              metadata:{
                order_id:orderId 
              },
              payment_intent_data:{
                metadata:{
                  orderId:orderId
                }
              },
            success_url: `${process.env.FRONTEND_URL}/order/${orderId}?success=true`,
            cancel_url: `${process.env.FRONTEND_URL}/order/${orderId}?canceled=true`,
          });
          res.json({ url: session.url });
    }else{
        res.status(404)
        throw new Error('Order not found')
    }
    
})


export { addOrderItems, getMyOrders, getOrderById, updateOrderToPaid, updateOrderToDelivered, getOrders,payWithStripe }