const { BadRequestError } = require('../errors')

const testUser = (req, res, next) => {
  if (req.user.name === 'test') {
    throw new BadRequestError('Test User. READ ONLY')
  }
  next()
}

module.exports = testUser
