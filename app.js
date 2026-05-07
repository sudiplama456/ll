import express from 'express'
import path from 'path'

const app = express()

app.use(express.static('frontend/dist'))

app.get('*', (req, res) => {
  res.sendFile(path.resolve('frontend/dist/index.html'))
})

export default app