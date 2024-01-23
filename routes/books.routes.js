const { isAuthenticated } = require('../error-handling/middlewares/route-guard.middleware');
const Book = require('../models/Book.model');
const router = require('express').Router()

router.get('/', async (req,res) => {
    try {
        const books = await Book.find().populate('createdBy')
        res.status(200).json(books)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error while getting books'})
    }
})

router.get('/:bookId', async (req,res) => {
    const {bookId} = req.params;
     try {
        const oneBook = await Book.findById(bookId)
        res.status(200).json(oneBook)
     } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error while getting books'})
     }
})

router.post('/', isAuthenticated,async (req,res) => {
    const payload = req.body 
    const {currentUserId} = req.tokenPayload
    try {
        const newBook = await Book.create({ ...payload, createdBy: currentUserId })
        res.status(201).json(newBook)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Error ocuurs'})
    }
} )

router.put('/:bookId' , isAuthenticated, async (req, res) => {
    const {bookId} = req.params;
    const bookToUpdate = await Book.findById(bookId)
    const {currentUserId} = req.tokenPayload
    try {
        if(editedBook.createdBy === currentUserId){
            const editedBook = await Book.findByIdAndUpdate(bookId, bookToUpdate, {new:true} )
            res.status(202).json(editedBook)
        }else{
            res.status(403).json({message: 'you are not allowed to updaye'})
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Not edited! Try again!"})
    }
})

router.delete('/:bookId', async (req,res) => {
    const {bookId} = req.params;
    const bookToDelete = await Book.findById(bookId)
    const {currentUserId} = req.tokenPayload

    try {
        if(bookToDelete.createdBy === currentUserId){
            const deletedBook = await Book.findByIdAndDelete(bookId)
            res.status(204).json({message : 'The book deleted'})
        }else{
            res.status(403).json({message: 'you are not allowed to delete'})
        }
        const deletedBook = await Book.findByIdAndDelete(bookId)
        res.status(204).json({message : 'The book deleted'})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Not deleted! Try again!"}) 
    }
})

module.exports = router;