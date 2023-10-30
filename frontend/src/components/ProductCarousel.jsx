import { Link } from "react-router-dom"
import { Carousel } from "react-bootstrap"
import { useGetTopProductsQuery } from "../slices/productsApiSlice"
import Loader from "./Loader"
import Message from "./Message"

const ProductCarousel = () => {
    const {data,isLoading,error}=useGetTopProductsQuery()

  return isLoading ? <Loader/> : error ? <Message variant="danger">{error}</Message> : (
    <Carousel pause="hover" className="bg-dark ">
        {data?.map(product=>(
            <Carousel.Item key={product._id}>
                <Link to={`/products/${product._id}`}>
                    <img src={product.image} alt={product.name} className="d-block img-fluid" style={{ maxHeight:'100%' }}/>
                    <Carousel.Caption className="carousel-caption w-100">
                        <h2>{product.name} (${product.price})</h2>
                    </Carousel.Caption>
                </Link>
            </Carousel.Item>
        ))}
    </Carousel>
  )
}

export default ProductCarousel