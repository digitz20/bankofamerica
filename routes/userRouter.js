const router = require('express').Router()


const { register, login, verifyUser } = require('../controller/userController')


router.post('/register', register)

router.post('/login', login)

router.get('/verify-User/:token', verifyUser)


module.exports = router

