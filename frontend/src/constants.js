// export const BASE_URL=process.env.NODE_ENV ==='development' ? 'http://localhost:5000' : 'https://api.example.com';

// here it is empty because we are using a proxy in vite config to redirect the requests to the backend
export const BASE_URL='';

export const PRODUCTS_URL='/api/products';
export const USER_URL='/api/users';
export const ORDERS_URL='/api/orders';
export const LOGIN_URL='/api/config/paypal';
export const STRIPE_PAY_URL='/api/create-checkout-session';
export const UPLOAD_URL='/api/upload';







