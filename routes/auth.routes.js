const router = require('express').Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { isAuthenticated } = require('../error-handling/middlewares/route-guard.middleware');

SALT_ROUNDS = 13;

router.post('/signup', async (req, res) => {
    const payload = req.body
    const salt = bcrypt.genSaltSync(SALT_ROUNDS)
    const passwordHash = bcrypt.hashSync(payload.password, salt)
    const userToRegister = { email: payload.email, passwordHash }
    try {
        const newUser = await User.create(userToRegister)
        res.status(201).json({ message: "The user signed up!", newUser })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "error occurs" })
    }
})

router.post('/login', async (req, res) => {
    const payload = req.body
    const potentialUser = await User.findOne({ email: payload.email.toLowerCase().trim() })

    try {
        if (potentialUser) {
            //password check
            if (bcrypt.compareSync(payload.password, potentialUser.passwordHash)) {
                const authToken = jwt.sign(
                    {
                        userId: potentialUser._id,
                    },
                    process.env.TOKEN_SECRET,
                    {
                        algorithm: 'HS256',
                        expiresIn: '6h'
                    }
                )
                res.status(200).json({ token: authToken })
            } else {
                // Incorrect password
                res.status(403).json({ message: 'Incorrect password' })
            }
        } else {
            // No user matching the email
            res.status(404).json({ message: 'User not found' })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }

})

router.get('/verify', isAuthenticated, async(req,res)=>{
    console.log(req.tokenPayload)
    const currentUser = await User.findById(req.tokenPayload.userId)
    res.status(200).json(currentUser)
})


module.exports = router