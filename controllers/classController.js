const asyncHandler = require('express-async-handler')

const Class = require('../models/classModel')
const User = require('../models/userModel')

//@desc    Create Class
//@route   POST /api/class/create
//@access  Private

const createClass = asyncHandler(async (req, res) => {
  const { type, startDate, duration, date, name, description } = req.body

  const user = await User.findById(req.user._id)

  if (user) {
    const create = await Class.create({
      type,
      startDate,
      duration,
      date,
      name,
      description,
      user: req.user._id,
    })
    if (create) {
      res.json({
        create,
        hasError: false,
        message: 'class created successfully',
      })
    } else {
      res.json({
        hasError: true,
        message: 'Sorry something went wrong',
      })
    }
  } else {
    res.json({
      hasError: true,
      message: 'Sorry something went wrong',
    })
  }
})

module.exports = {
  createClass,
}
