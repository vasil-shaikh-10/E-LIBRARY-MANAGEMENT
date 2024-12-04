const {Router} = require('express')
const { BookCreate, BookShow, BookShowId, BookUpdate, BookDelete, BooksBorrow, BookReturn } = require('../../controllers/Book/books.controller')
const book = Router()

book.post('/create',BookCreate)
book.get('/show',BookShow)
book.get('/single/:id',BookShowId)
book.patch('/update/:id',BookUpdate)
book.delete('/delete/:id',BookDelete)
book.post('/borrow/:id',BooksBorrow)
book.post('/return/:id',BookReturn)
module.exports = book