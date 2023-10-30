import { useState,useEffect } from "react"
import {Link,useNavigate,useParams} from "react-router-dom"
import { Form,Button } from "react-bootstrap"
import { FaArrowLeft } from "react-icons/fa"
import { useGetProductDetailsQuery,useUpdateProductMutation, useUploadProductImageMutation } from "../../slices/productsApiSlice"
import {toast} from "react-toastify"
import {Message,Loader,FormContainer}  from "../../components"
const ProductEditScreen = () => {
    const navigate=useNavigate()
    const {id:productId}=useParams()
    const [name,setName]=useState("")
    const [price,setPrice]=useState(0)
    const [image,setImage]=useState("")
    const [brand,setBrand]=useState("")
    const [category,setCategory]=useState("")
    const [countInStock,setCountInStock]=useState(0)
    const [description,setDescription]=useState("")
    const [uploading,setUploading]=useState(false)
    const [updateProduct,{isLoading,error}]=useUpdateProductMutation()
    const {data:product,isLoading:productLoading,error:productError}=useGetProductDetailsQuery(productId)
    const [addImage,{isLoading:loadingUpload}] =useUploadProductImageMutation()
    useEffect(()=>{
        if(product)
        {
            setName(product.name)
            setPrice(product.price)
            setImage(product.image)
            setBrand(product.brand)
            setCategory(product.category)
            setCountInStock(product.countInStock)
            setDescription(product.description)
        }
    },[product])
    const uploadFileHandler=async(e)=>{
        const file=e.target.files[0]
        const formData=new FormData()
        formData.append("image",file)
        try {
            const res=await addImage(formData).unwrap()
            toast.success(res.message)
            setImage(res.image)
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }
    }
    const submitHandler=async(e)=>{
        e.preventDefault()
        const updatedProduct={
            productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description
        }
        try {
            const res=await updateProduct(updatedProduct);
            toast.success("Product updated successfully")
            navigate("/admin/productList")
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }
    }
  return (
    <FormContainer>
        <Link to="/admin/productList" className="btn btn-light my-3">
            <FaArrowLeft/> Go Back
        </Link>
        <h1>Edit Product</h1>
        {isLoading && <Loader/>}
        {error && <Message variant="danger">{error}</Message>}
        {productLoading && <Loader/>}
        {productError && <Message variant="danger">{productError}</Message>}
        <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="my-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e)=>setName(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId="price" className="my-3">
                <Form.Label>Price</Form.Label>
                <Form.Control type="number" placeholder="Enter price" value={price} onChange={(e)=>setPrice(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId="image" className="my-3">
                <Form.Label>Image</Form.Label>
                <Form.Control type="text" placeholder="Enter image url" value={image} onChange={(e)=>setImage(e.target.value)}></Form.Control>
                <Form.Control type="file" placeholder="choose file" onChange={uploadFileHandler} />
            </Form.Group>
            <Form.Group controlId="brand" className="my-3">
                <Form.Label>Brand</Form.Label>
                <Form.Control type="text" placeholder="Enter brand" value={brand} onChange={(e)=>setBrand(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId="category" className="my-3">
                <Form.Label>Category</Form.Label>
                <Form.Control type="text" placeholder="Enter category" value={category} onChange={(e)=>setCategory(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId="countInStock" className="my-3">
                <Form.Label>Count In Stock</Form.Label>
                <Form.Control type="number" placeholder="Enter count in stock" value={countInStock} onChange={(e)=>setCountInStock(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId="description" className="my-3">
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" placeholder="Enter description" value={description} onChange={(e)=>setDescription(e.target.value)}></Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary" disabled={isLoading}>Update</Button>
        </Form>
    </FormContainer>
  )
}

export default ProductEditScreen