const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    availability: { type: Boolean, default: true },
    borrowAdd:[
        {
            userId:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
            borrowDate:{type:Date,default:Date.now()},
            returnDate:{type:Date},
        },
    ],
    returnBy:{type:Boolean,default:false},
    createBy:{type:mongoose.Schema.Types.ObjectId, ref:'User',required:true}
})

const Books = mongoose.model('Book',bookSchema)
module.exports = Books