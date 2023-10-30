import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../slices/usersApiSlice";
import { toast } from "react-toastify";
import {Message,Loader,FormContainer}  from "../../components"
const UserEditScreen = () => {
  const navigate = useNavigate();
  const { id: userId } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [updateUser, { isLoading, error }] = useUpdateUserMutation();
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
    refetch,
  } = useGetUserDetailsQuery(userId);

  useEffect(() => {
    if (user) {
      setEmail(user?.email);
      setName(user?.name);
      setIsAdmin(user?.isAdmin);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, isAdmin}).unwrap();
      toast.success("User Updated Successfully");
      refetch();
      navigate("/admin/userList");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };
  return (
    <FormContainer>
      <Link to="/admin/userList" className="btn btn-light my-3">
            <FaArrowLeft/> Go Back
        </Link>
        <h1>Edit Product</h1>
        <Form onSubmit={(e)=>submitHandler(e)}>
            <Form.Group controlId="name" className="my-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e)=>setName(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId="email" className="my-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e)=>setEmail(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId="isAdmin" className="my-3">
                <Form.Check type="checkbox" label="Is Admin" checked={isAdmin} onChange={(e)=>setIsAdmin(e.target.checked)}></Form.Check>
            </Form.Group>
            <Button type="submit" variant="primary" disabled={isLoading}>Update</Button>
        </Form>
        {error && <Message variant="danger">{error}</Message>}
            {isLoading && <Loader/>}
            {userLoading && <Loader/>}
            {userError && <Message variant="danger">{userError}</Message>}
    </FormContainer>
  );
};

export default UserEditScreen;
