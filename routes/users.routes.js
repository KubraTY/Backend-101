const User = require('../models/User.model')

const router = require('express').Router()

router.get('/', async(req,res)=>{
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Error occurs"})
    }
})

router.post('/', async(req,res) => {
    const payload = req.body
    try {
        const newUser = await User.create(payload)
        res.status(201).json(newUser)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "new user does not created"})
    }
})


module.exports =  router