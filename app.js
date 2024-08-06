require('dotenv').config()
require('express-async-errors')

const path = require('path')

// extra security packages
const helmet = require('helmet')
const xss = require('xss-clean')

// Swagger

const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')

const swaggerDocument = YAML.load('./swagger.yaml')

// express
const express = require('express')
const app = express()

// rest of packages
const cookieParser = require('cookie-parser')
const fileupload = require('express-fileupload')

// database
const connectDB = require('./db/connect')

// routers
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const orderRoutes = require('./routes/orderRoutes')

// middleware
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')

app.use('/', express.static(path.join(__dirname, './client/dist')))
app.use('/', express.static(path.join(__dirname, './admin/dist')))

app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(helmet())
app.use(xss())

app.use(express.static('./public'))
app.use(fileupload())

app.use('/api/v1/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/reviews', reviewRoutes)
app.use('/api/v1/orders', orderRoutes)

app.get('/client', (req, res) => {
  res.redirect('/')
})
app.get('/admin', (req, res) => {
  res.redirect('/admin/landing')
})
app.get('/client/*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/dist', 'index.html'))
})

app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, './admin/dist', 'index.html'))
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/default', 'index.html'))
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
