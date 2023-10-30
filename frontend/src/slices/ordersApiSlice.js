import {apiSlice} from './apiSlice';
import { ORDERS_URL } from '../constants';

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: ORDERS_URL,
                method: 'POST',
                body:{...order}
            })
        }),
        getOrderById: builder.query({
            query: (id) => `${ORDERS_URL}/${id}`,
            keepUnusedDataFor: 5
        }),
        getMyOrders: builder.query({
            query: () => `${ORDERS_URL}/myorders`
        }),
        handleCheckout:builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/create-checkout-session`,
                method: 'POST',
                body:{orderId:orderId}
            })
        }),
        getMyOrders: builder.query({
            query: () => `${ORDERS_URL}/myorders`
        }),
        getOrders: builder.query({
            query: () => `${ORDERS_URL}`,
            keepUnusedDataFor: 5
        }),
        deliverOrder: builder.mutation({
            query: (id) => ({
                url: `${ORDERS_URL}/${id}/deliver`,
                method: 'PUT',
            })
        }),
    })
});

export const {useCreateOrderMutation, useGetOrderByIdQuery, useGetMyOrdersQuery,useHandleCheckoutMutation,useUpdateOrderToPaidMutation,useGetOrdersQuery,useDeliverOrderMutation} = ordersApiSlice;