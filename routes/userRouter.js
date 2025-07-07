const router = require('express').Router()


const { register, login, verifyUser, logout } = require('../controller/userController')


router.post('/register', register)

router.post('/login', login)

router.get('/verify-User/:token', verifyUser)

router.post('/logout', logout)


module.exports = router

