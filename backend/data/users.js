import bcrypt from 'bcryptjs'
const users=[
    {
        name:'Admin User',
        email:'admin@gmail.com',
        password:bcrypt.hashSync('123456',10),
        isAdmin:true,
    },
    {
        name:'john doe',
        email:'jogh@gmail.com',
        password:bcrypt.hashSync('123456',10),
        isAdmin:false,
    },
    {
        name:'jane doe',
        email:'jane@gmail.com',
        password:bcrypt.hashSync('123456',10),
        isAdmin:false,
    },
]

export default users;