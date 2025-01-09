import express from 'express'
import defaultErrorHandler from '~/middlewares/error.middleware'
import usersRouter from '~/routes/users.router'
import databaseService from '~/services/database.services'
const app = express()
const PORT = 4000
databaseService.connect()

app.use(express.json())

app.use('/users', usersRouter)

app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
