import { useState } from "react"
import { Form, Button } from "react-bootstrap"
import { useParams,useNavigate } from "react-router-dom"

const Search = () => {
    const {keyword}=useParams()
    const navigate=useNavigate()
    const [search,setSearch]=useState(keyword || "")
    const submitHandler=(e)=>{
        e.preventDefault()
        if(search.trim())
        {
            navigate(`/search/${search}`)
            setSearch("")
        }
        else
        {
            navigate("/")
        }
    }

  return (
    <Form onSubmit={submitHandler} className="d-flex gap-2 m-2">
        <Form.Control type="text" name="q" onChange={(e)=>setSearch(e.target.value)} placeholder="Search Products..." className="mr-sm-2 ml-sm-5" value={search} />
        <Button type="submit" variant="outline-success" className="p-2">Search</Button>
    </Form>
  )
}

export default Search