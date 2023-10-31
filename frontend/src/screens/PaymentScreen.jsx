import  { useEffect, useState } from 'react'
import { Form,Button,Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { savePaymentMethod } from '../slices/cartSlice'
import {FormContainer,CheckoutSteps}  from "../components"
const PaymentScreen = () => {
    const [paymentMethod, setPaymentMethod] = useState('Stripe')
    const dispatch = useDispatch()
    const navigate=useNavigate()
    const {shippingAddress}=useSelector(state=>state.cart)
    useEffect(() => {
        if(!shippingAddress.address){
            navigate('/shipping')
        }
    }, [shippingAddress,navigate])
    
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }
  return (
    <FormContainer>
        <CheckoutSteps step1 step2 step3 />
        <h1>Payment method</h1>
        <Form onSubmit={submitHandler}>
            <Form.Group>
                <Form.Label as='legend'>Select Method</Form.Label>
                <Col> 
                    {/* <Form.Check
                        type='radio'
                        label='PayPal or Credit Card'
                        id='PayPal'
                        name='paymentMethod'
                        value='PayPal'
                        checked
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    ></Form.Check> */}
                    <Form.Check
                        type='radio'
                        label='Stripe'
                        id='Stripe'
                        name='paymentMethod'
                        value='Stripe'
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    ></Form.Check>
                </Col>
            </Form.Group>
            <Button type='submit' variant='primary' className='mt-3'>
                Continue
            </Button>
        </Form>
    </FormContainer>
  )
}

export default PaymentScreen