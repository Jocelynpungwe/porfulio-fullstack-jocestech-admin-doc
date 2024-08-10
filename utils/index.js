const checkPermissions = require('./checkPermission')
const createTokenUser = require('./createTokenUser')
const { createJWT, verifyJWT, attachCookiesToResponse } = require('./jwt')
const sendVerificationEmail = require('./sendVerficationEmail')
const sendResetPasswordEmail = require('./sendResetPasswordEmail')
const sendNewsLetterEmail = require('./sendNewsLetterEmail')
module.exports = {
  createJWT,
  verifyJWT,
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendNewsLetterEmail,
}
