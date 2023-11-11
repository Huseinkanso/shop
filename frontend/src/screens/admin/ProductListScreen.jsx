import { LinkContainer } from "react-router-bootstrap"
import {Table,Button,Row,Col, Container} from "react-bootstrap"
import { FaTimes,FaEdit,FaEye } from "react-icons/fa"
import {Message,Loader,Paginate}  from "../../components"
import { useGetProductsQuery,useCreateProductMutation, useDeleteProductMutation } from "../../slices/productsApiSlice"
import {toast} from "react-toastify"
import {useParams} from "react-router-dom"
const ProductListScreen = () => {
    const {pageNumber,keyword}=useParams()
    const {data,isLoading,error,refetch}=useGetProductsQuery({pageNumber,keyword})
    const [createProduct,{isLoading:createProductLoading}] = useCreateProductMutation()

    const createProductHandler=async()=>{
        if(window.confirm("Are you sure?"))
        {
            try {
                await createProduct().unwrap()
                refetch()
                toast.success("Product created successfully")
            } catch (error) {
                toast.error(error?.data?.message || error?.error)
            }
        }
    }
    const [deleteProduct,{isLoading:loadingDeleteProduct}] = useDeleteProductMutation()
    const deleteHandler=async (id)=>{
        if(window.confirm("Are you sure?"))
        {
            try {
                const res=await deleteProduct(id).unwrap()
                toast.success(res.message)
                refetch()
            } catch (error) {
                toast.error(error?.data?.message || error?.error)
            }
        }
    }
  return (
    <Container>
        <Row>
            <Col>
                <h1>Products</h1>
            </Col>
            <Col className="text-end">
                <Button className="my-3" onClick={createProductHandler}>
                    <FaEdit/> Create Product
                </Button>
            </Col>
        </Row>
        {createProductLoading && <Loader/>}
        {isLoading ? <Loader/> : error ? <Message variant="danger">{error}</Message> : (
            <Table striped bordered hover responsive className="table-sm">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Brand</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.products?.length!==0 && data.products.map((product)=>(
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.name}</td>
                            <td>${product.price}</td>
                            <td>{product.category}</td>
                            <td>{product.brand}</td>
                            <td>
                            <LinkContainer to={`/products/${product._id}`}>
                                    <Button variant="light" className="btn-sm mx-1" >
                                        <FaEye/>
                                    </Button>
                                </LinkContainer>
                                <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                    <Button variant="light" className="btn-sm mx-1" >
                                        <FaEdit/>
                                    </Button>
                                </LinkContainer>
                                <Button variant="danger" className="btn-sm mx-1" onClick={()=>deleteHandler(product._id)}>
                                    <FaTimes/>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )}
        
        <Paginate pages={data?.pages} page={data?.page} isAdmin={true} keyword={keyword && keyword} />
    </Container>
  )
}

export default ProductListScreen