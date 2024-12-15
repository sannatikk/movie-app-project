import express from 'express'
import cors from 'cors'
import userRouter from './routes/userRouter.js'
import groupsRouter from './routes/groupsRouter.js'
import groupRouter from './routes/groupRouter.js'
import reviewRouter from './routes/reviewRouter.js'
import favoriteRouter from './routes/favoriteRouter.js'
import pinnedRouter from './routes/pinnedRouter.js'
const port = process.env.PORT

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.use('/user', userRouter)    // Login/Register/Delete
app.use('/groups', groupsRouter)
app.use('/group', groupRouter)
app.use('/reviews', reviewRouter)
app.use('/favorites', favoriteRouter)
app.use('/pinned', pinnedRouter)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({ error: err.message })
})

app.listen(port)