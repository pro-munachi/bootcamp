const router = require('express').Router()
const { registerUser, loginUser } = require('../controllers/userController')
const { admin, protect } = require('../middleware/authMiddleware')

router.route('/register').post(registerUser)

router.route('/login').post(loginUser)

module.exports = router
