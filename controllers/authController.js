const { StatusCodes } = require('http-status-codes')
const {
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} = require('../errors')
const User = require('../models/User')
const Token = require('../models/Token')
const News = require('../models/News')
const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require('../utils')
const crypto = require('crypto')

const registerUser = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    throw new BadRequestError('Please provide credentials')
  }

  const emailAlreadyExists = await User.findOne({ email })

  if (emailAlreadyExists) {
    throw new BadRequestError('Email already exists')
  }

  //   first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0
  const role = isFirstAccount ? 'admin' : 'user'

  const verificationToken = crypto.randomBytes(40).toString('hex')

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  })

  const origin =
    'https://portfolio-fullstack-jocestech-admin-doc.onrender.com/client'

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  })

  res.status(StatusCodes.CREATED).json({
    msg: 'Success! Please check your email to verify account',
  })
}

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Verification Failed')
  }

  if (verificationToken !== user.verificationToken) {
    throw new UnauthenticatedError('Verification Failed')
  }

  await User.findOneAndUpdate(
    {
      email,
    },
    {
      isVerified: true,
      verified: Date.now(),
      verificationToken: '',
    },
    {
      new: true,
      runValidators: true,
    }
  )

  res.status(StatusCodes.OK).json({
    msg: 'Email Verified',
  })
}
const loginUser = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  const isMatchPassword = await user.comparePassword(password)

  if (!isMatchPassword) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  if (!user.isVerified) {
    throw new UnauthenticatedError('Please verify your email')
  }

  const tokenUser = createTokenUser(user)

  let refreshToken = ''
  const existingToken = await Token.findOne({ user: user._id })

  if (existingToken) {
    const { isValid } = existingToken
    if (!isValid) {
      throw new UnauthenticatedError('Invalid Credentials')
    }
    refreshToken = existingToken.refreshToken
    attachCookiesToResponse({ res, user: tokenUser, refreshToken })
    res.status(StatusCodes.OK).json({ user: tokenUser })
    return
  }

  refreshToken = crypto.randomBytes(40).toString('hex')
  const userAgent = req.headers['user-agent']
  const ip = req.ip
  const userToken = { refreshToken, ip, userAgent, user: user._id }
  await Token.create(userToken)

  attachCookiesToResponse({ res, user: tokenUser, refreshToken })

  res.status(StatusCodes.OK).json({ user: tokenUser })
}

const loginAdmin = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  if (user.role === 'user') {
    throw new UnauthorizedError('Not Permmited To Access Route ')
  }

  const isMatchPassword = await user.comparePassword(password)

  if (!isMatchPassword) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  const tokenUser = createTokenUser(user)

  let refreshToken = ''
  const existingToken = await Token.findOne({ user: user._id })

  if (existingToken) {
    const { isValid } = existingToken
    if (!isValid) {
      throw new UnauthenticatedError('Invalid Credentials')
    }
    refreshToken = existingToken.refreshToken
    attachCookiesToResponse({ res, user: tokenUser, refreshToken })
    res.status(StatusCodes.OK).json({ user: tokenUser })
    return
  }

  refreshToken = crypto.randomBytes(40).toString('hex')
  const userAgent = req.headers['user-agent']
  const ip = req.ip
  const userToken = { refreshToken, ip, userAgent, user: user._id }
  await Token.create(userToken)

  attachCookiesToResponse({ res, user: tokenUser, refreshToken })

  res.status(StatusCodes.OK).json({ user: tokenUser })
}

const logoutUser = async (req, res) => {
  await Token.findOneAndDelete({
    user: req.user.userId,
  })
  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })
  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' })
}

const forgotPassword = async (req, res) => {
  const { email } = req.body

  if (!email) {
    throw new BadRequestError('Please Provide valid email')
  }

  const user = await User.findOne({ email })

  if (user) {
    const passwordToken = crypto.randomBytes(70).toString('hex')
    const origin =
      'https://portfolio-fullstack-jocestech-admin-doc.onrender.com/client'

    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    })

    const tenMinutes = 1000 * 60 * 10
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes)
    user.passwordToken = passwordToken
    user.passwordTokenExpirationDate = passwordTokenExpirationDate
    await user.save()
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: 'Please check your email for reset password link' })
}

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body
  if (!token || !email || !password) {
    throw new BadRequestError('Please provide all values')
  }
  const user = await User.findOne({ email })
  if (user) {
    const currentDate = new Date()

    if (
      user.passwordToken === token &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password
      user.passwordToken = null
      user.passwordTokenExpirationDate = null
      await user.save()
    }
  }
  res.status(StatusCodes.OK).json({ msg: 'Password Reseted' })
}

const newsLetterJoin = async (req, res) => {
  const { email } = req.body
  if (!email) {
    throw new BadRequestError('Please Provide valid email')
  }
  const news = await News.create({ email })
  res.status(StatusCodes.OK).json({
    msg: `Thank you for joining the news letter`,
  })
}

module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  newsLetterJoin,
}
