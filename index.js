const express = require('express')
const cors = require('cors')
const cookie = require('cookie-parser')
const DataBaseConnect = require('./configs/db.configs')
const AuthRouter = require('./routers/Auth/auth.router')
const book = require('./routers/Book/books.router')
const bookManageUser = require('./middlewares/bookManageUser')
require('dotenv').config()
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookie())
app.use(cors())
app.use('/api/auth',AuthRouter)
app.use('/api/book',bookManageUser,book)
app.get('/',(req,res)=>{
    res.json({msg:"Welcome to E-Libray"})
})

app.listen(process.env.PORT,()=>{
    console.log("Server Start :- ",process.env.PORT)
    DataBaseConnect()
})
module.exports = app