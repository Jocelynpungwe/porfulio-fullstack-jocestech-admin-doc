const express = require('express')
const router = express.Router()
const authenticationMiddleware = require('../middleware/authentication')
const {
  registerUser,
  loginUser,
  loginAdmin,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  newsLetterJoin,
} = require('../controllers/authController')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/loginAdmin', loginAdmin)
router.delete('/logout', authenticationMiddleware, logoutUser)
router.post('/verify-email', verifyEmail)
router.post('/reset-password', resetPassword)
router.post('/forgot-Password', forgotPassword)
router.post('/newsLetter', newsLetterJoin)
module.exports = router
