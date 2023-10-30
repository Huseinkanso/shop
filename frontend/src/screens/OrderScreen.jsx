import { useEffect} from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Container,
  Image,
  Button,
  ListGroup,
  Card,
} from "react-bootstrap";
import {
  useDeliverOrderMutation,
  useGetOrderByIdQuery,
  useHandleCheckoutMutation,
} from "../slices/ordersApiSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {Message,Loader}  from "../components"
const OrderScreen = () => {

  const params=useLocation();
  const success=Boolean(params.search.split("=")[1])
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderByIdQuery(orderId);
  const [handleCheckout, { isLoading: isCheckoutLoading }] = useHandleCheckoutMutation();
  const [deliverOrder,{isLoading:deliverLoading,error:deliverError}]=useDeliverOrderMutation();
  const {userInfo}=useSelector(state=>state.auth)
  const paid = async () => {
    await refetch().unwrap();
    toast.success("Payment Successful");
  };
  useEffect(()=>{
    if(success)
    {
      paid();
    }
  },[success])
  
  const handlePayment= async()=>{
    const res= await handleCheckout(orderId).unwrap();
    if(res.url)
    {
      window.location.href=res.url;
    }
  }

  const handleDeliver=async()=>{
    try {
      await deliverOrder(orderId).unwrap();
      await refetch().unwrap();
      toast.success("Order Delivered");
    } catch (error) {
      toast.error(error?.data?.message || error?.message);
    }
  }
  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <Container className="justify-content-center">
        <h1 className="orderHeading">Order {order._id}</h1>
        <Row>
          <Col md={9} className="my-2">
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Shipping</h2>
                <p>
                  <strong>Name: </strong>
                  {order.user.name}
                </p>
                <p>
                  <strong>Email: </strong>
                  <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                </p>
                <p>
                  <strong>Address: </strong>
                  {order.shippingAddress.address},{order.shippingAddress.city},
                  {order.shippingAddress.postalCode},
                  {order.shippingAddress.country}
                </p>
                {order.isDelivered ? (
                  <Message variant="success">
                    Delivered on {order.deliveredAt}
                  </Message>
                ) : (
                  <Message variant="danger">Not Delivered</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Payment Method</h2>
                <p>
                  <strong>Method: </strong>
                  {order.paymentMethod}
                </p>
                {order.isPaid ? (
                  <Message variant="success">Paid on {order.paidAt}</Message>
                ) : (
                  <Message variant="danger">Not Paid</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Order Items</h2>
                {order.orderItems.length === 0 ? (
                  <Message>Order is empty</Message>
                ) : (
                  <ListGroup variant="flush">
                    {order.orderItems.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={1}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Col>
                          <Col>
                            <Link to={`/products/${item.product}`}>
                              {item.name}
                            </Link>
                          </Col>
                          <Col md={4}>
                            {item.qty} x ${item.price} = $
                            {item.qty * item.price}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
            
            {isCheckoutLoading && <Loader /> }
          </Col>

          <Col className="my-2">
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
                {deliverLoading && <Loader />}
                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListGroup.Item>
                    <Button onClick={handleDeliver}>Mark as Delivered</Button>
                  </ListGroup.Item>
                )}

              </ListGroup>
              </Card>
              {!order.isPaid && <Button onClick={handlePayment} className="my-4">proceed to stripe</Button> }
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default OrderScreen;
