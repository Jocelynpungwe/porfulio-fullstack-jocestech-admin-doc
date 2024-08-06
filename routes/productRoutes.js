const express = require('express')
const router = express.Router()
const {
  getAllProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require('../controllers/productController')

const { getSingleProductReviews } = require('../controllers/reviewController')

const authenticationMiddleware = require('../middleware/authentication')
const authorizeMiddleware = require('../middleware/authorize')
const testUserMiddleware = require('../middleware/testUser')

router.get('/', getAllProducts)
router.get('/:id', getSingleProduct)
router.post(
  '/',
  authenticationMiddleware,
  authorizeMiddleware('admin'),
  testUserMiddleware,
  createProduct
)
router.patch(
  '/:id',
  authenticationMiddleware,
  authorizeMiddleware('admin'),
  testUserMiddleware,
  updateProduct
)
router.delete(
  '/:id',
  authenticationMiddleware,
  authorizeMiddleware('admin'),
  testUserMiddleware,
  deleteProduct
)
router.post(
  '/uploadImage',
  authenticationMiddleware,
  authorizeMiddleware('admin'),
  testUserMiddleware,
  uploadImage
)

router.get('/review/:id', getSingleProductReviews)

module.exports = router
