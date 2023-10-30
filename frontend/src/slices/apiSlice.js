import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {BASE_URL} from '../constants.js'


const baseQuery=fetchBaseQuery({baseUrl:BASE_URL});


// this slice is the parent of all the other slices
export const apiSlice=createApi({
    reducerPath:'api',
    baseQuery,
    // types of data that we will be fetching
    tagTypes:['Products','Users','Orders','Paypal'],
    endpoints:(builder)=>({
        //...
    }),
});
