const { UnauthenticatedError, UnauthorizedError } = require('../errors')
const { verifyJWT } = require('../utils/jwt')
const Token = require('../models/Token')
const { attachCookiesToResponse } = require('../utils')
const authenticateUser = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies

  try {
    if (accessToken) {
      const payload = verifyJWT(accessToken)
      req.user = payload.user
      return next()
    }

    const payload = verifyJWT(refreshToken)

    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    })

    if (!existingToken || !existingToken?.isValid) {
      throw new UnauthorizedError('Authentication Invalid')
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    })
    req.user = payload.user
    next()
  } catch (error) {
    throw new UnauthorizedError('Authentication Invalid')
  }
}

module.exports = authenticateUser
