const router = require('express').Router()


const { register, login, getDashboard, createDashboard } = require('../controller/dashboardController')

router.post('/createDashboard/:id', createDashboard)
router.get('/getDashboard/:userID', getDashboard)




module.exports = router

