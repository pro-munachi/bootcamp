const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

const generateToken = require('../utils/generatetoken')
const User = require('../models/userModel')
const Notification = require('../models/notificationModel')
const { forgotPasswordTemplate, createdUser } = require('../utils/userUtil')

//@desc    Register user & get token
//@route   POST /api/users/register
//@access  Public

const registerUser = asyncHandler(async (req, res) => {
  let { email, password, passwordCheck, displayName, roles, phoneNumber } =
    req.body

  if (!displayName) {
    displayName = email
  }

  const salt = await bcrypt.genSalt()
  const passwordHash = await bcrypt.hash(password, salt)

  const userExists = await User.findOne({ email })

  const number = await User.findOne({ phoneNumber })

  if (number || userExists) {
    res.json({
      hasError: true,
      message: 'Email or Number already exist',
    })
  } else {
    const user = await User.create({
      displayName,
      email,
      password,
      roles,
      phoneNumber,
    })

    if (user) {
      const notify = await Notification.create({
        user: user._id,
        message: 'your account has been successfully created',
        isSeen: false,
      })

      var transporter = nodemailer.createTransport({
        host: 'mail.midraconsulting.com',
        port: 8889,
        secure: false, // upgrade later with STARTTLS
        auth: {
          user: 'bobby@midraconsulting.com',
          pass: '1nt3n@t10n@l',
        },
      })

      let data = createdUser(user.displayName)

      const mailOptions = {
        from: 'bobby@midraconsulting.com', // sender address
        to: user.email, // list of receivers
        subject: 'Created an account', // Subject line
        html: data, // plain text body
      }

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) console.log(err)
        else console.log(info)
      })

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
