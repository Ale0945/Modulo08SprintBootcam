const express = require('express')
const cors = require('cors')
const db = require('./app/models')

const bootcampRoutes = require('./app/routes/bootcamp.routes.js')
const userRoutes = require('./app/routes/user.routes.js')

const PORT = process.env.PORT ?? 3000
const app = express()

app.disable('x-powered-by')

app.use(express.json())
app.use(cors({ origin: '*' }))

app.use('/api', userRoutes)
app.use('/api', bootcampRoutes)

app.listen(PORT, () => {
  console.log(`escuchando en http://localhost:${PORT}`)
  db.sequelize
    .sync({ force: false })
    .then(() => {
      console.log('connect DDBB success')
    })
    .catch(console.log)
})