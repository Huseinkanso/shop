import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser';

import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js';

import productRoutes from './routes/productRoutes.js';
import userRoute from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import { notFound,errorHandler } from './middleware/errorMiddleware.js';
const port=process.env.PORT;
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// cookie parser middleware (allow us to parse cookie) by req.cookies.token
app.use(cookieParser())

connectDB().then(() => console.log('connected db'))

app.listen(port,()=>{
    console.log(`server at http://localhost:${port}`)
});

const __dirname = path.resolve()
app.use('/uploads',express.static(path.join(__dirname,'/uploads')))

if(process.env.NODE_ENV==='production'){
    // set static folder
    app.use(express.static(path.join(__dirname,'/frontend/dist')))

    // any route that is not api route
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'frontend','dist','index.html'))
    })
}else 
{
    app.get('/',(req,res)=>{
        res.send('API is running')
    })
}

app.use('/api/products',productRoutes)
app.use('/api/users',userRoute)
app.use('/api/orders',orderRoutes)
app.use('/api/upload',uploadRoutes)
app.use(notFound,errorHandler)
