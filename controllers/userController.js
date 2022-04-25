const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')

const generateToken = require('../utils/generatetoken')
const User = require('../models/userModel')
// const { forgotPasswordTemplate, createdUser } = require('../utils/userUtil')

//@desc    Register user & get token
//@route   POST /api/users/register
//@access  Public

const registerUser = asyncHandler(async (req, res) => {
  let { email, password, firstName, lastName, phoneNumber } = req.body

  if (!displayName) {
    displayName = email
  }

  const userExists = await User.findOne({ email })

  const number = await User.findOne({ phoneNumber })

  if (number || userExists) {
    res.json({
      hasError: true,
      message: 'Email or Number already exist',
    })
  } else {
    const user = await User.create({
      firstName,
      email,
      password,
      lastName,
      phoneNumber,
    })

    if (user) {
      res.status(201).json({
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
        roles: user.roles,
        token: generateToken(user._id),
        hasError: false,
        profilePic: user.profilePic,
        phoneNumber: user.phoneNumber,
        notify,
      })
    } else {
      res.status(400)
      throw new Error('Invalid user data')
    }
  }
})

//@desc    Login user & get token
//@route   POST /api/users/login
//@access  Public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      displayName: user.displayName,
      email: user.email,
      roles: user.roles,
      token: generateToken(user._id),
      isAdmin: user.isAdmin,
      hasError: false,
      profilePic: user.profilePic,
      phoneNumber: user.phoneNumber,
    })
  } else {
    res.json({
      error: 'Invalid email or password',
      hasError: true,
    })
  }
})

module.exports = {
  registerUser,
  loginUser,
}
