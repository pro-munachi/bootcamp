const router = require('express').Router()
const { createClass } = require('../controllers/classController')
const { admin, protect } = require('../middleware/authMiddleware')

router.route('/create').post(protect, createClass)

module.exports = router
