import { useEffect,useState } from "react"
import { Table,Row,Col,Button,Form,Container } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import {toast} from 'react-toastify'
import {Message,Loader}  from "../components"
import { useProfileMutation } from "../slices/usersApiSlice"
import { setCredentials } from "../slices/authSlice"
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice"
import { FaTimes } from "react-icons/fa"
const ProfileScreen = () => {
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")
    const dispatch=useDispatch()
    const {userInfo}=useSelector(state=>state.auth)
    const [updateProfile,{isLoading:loadingUpdateProfile}]= useProfileMutation()
    const {data:orders,isLoading,error} =useGetMyOrdersQuery()
    useEffect(()=>{
        if(userInfo)
        {
            setName(userInfo.name)
            setEmail(userInfo.email)
        }
    },[userInfo.name,userInfo.email])
    const submitHandler=async(e)=>{
        e.preventDefault()
        if(password!==confirmPassword)
        {
            toast.error("Passwords do not match")
        }
        else
        {
            try {
                const res=await updateProfile({_id:userInfo._id,name,email,password}).unwrap()
                dispatch(setCredentials(res))
                toast.success("Profile Updated")
            } catch (error) {
                toast.error(error?.data?.message || error.error)
            }
        }
    }
  return (
    <Container>
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="name" placeholder="Enter Name" value={name} onChange={(e)=>setName(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" placeholder="Enter Email" value={email} onChange={(e)=>setEmail(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter Password" value={password} onChange={(e)=>setPassword(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="text" placeholder="Confirm Password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Button type="submit" variant="primary">Update</Button>
                    {loadingUpdateProfile && <Loader/>}
                </Form>
            </Col>
            <Col md={9}>
                <h2>My Orders</h2>
                {isLoading ? (<h1>f</h1>) : error ? <Message variant="danger">{error?.data?.message || error.message}</Message> : (
                    <Table striped bordered hover responsive className="table-sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Delivered</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders?.map(order=>(
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0,10)}</td>
                                    <td>{order.totalPrice}</td>
                                    <td>{order.isPaid ? order.paidAt.substring(0,10) : <FaTimes/>}</td>
                                    <td>{order.isDelivered ? order.deliveredAt.substring(0,10) : <FaTimes/>}</td>
                                    <td>
                                        <LinkContainer to={`/order/${order._id}`}>
                                            <Button variant="light">Details</Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row>
    </Container>
  )
}

export default ProfileScreen