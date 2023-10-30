import { Row, Col, Container } from "react-bootstrap";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import { Link, useParams } from "react-router-dom";
import {Message,Loader,Paginate,ProductCarousel,Meta,Product}  from "../components"

const HomeScreen = () => {
  const {pageNumber,keyword}= useParams();
  const { data, isLoading,error} = useGetProductsQuery({pageNumber,keyword});
  return (
    <>
      {isLoading ? (
        <Loader/>
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error?.error} </Message>
      ) : (
        <>
          <Container>
          {keyword ? (<div className="text-end" ><Link to="/" className="btn btn-light ">Reset Search</Link></div>) : <ProductCarousel/>}
          <Meta  />
            <h1 className="heading">Latest Products</h1>
            <Row className="my-3 justify-content-center align-items-center">
              {data.products.map((product) => (
                <Col  key={product.name} sm={10} md={6} lg={4} xl={3} >
                  <Product product={product} />
                </Col>
              ))}
            </Row>
              <Paginate pages={data?.pages} page={data?.page} keyword={keyword && keyword} />
          </Container>
        </>
      )}
    </>
  );
};

export default HomeScreen;
