const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const http = require('http')
const path = require('path')
var bodyParser = require('body-parser')
const { Server } = require('socket.io')
const WebSockets = require('./utils/WebSockets.js')

require('dotenv').config()

//setup express

const app = express()

app.use(bodyParser.json({ limit: '50mb' }))
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  })
)

app.use(express.json())
app.use(
  cors({
    origin: '*',
  })
)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server has started in port: ${PORT}`))

// setup mongoose

mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) throw err
    console.log('Mongodb connection successful')
  },
  { useFindAndModify: false }
)

// setup routes

app.use('/users', require('./routes/userRouter'))
app.use('/class', require('./routes/classRouter'))

/** Create HTTP server. */
const server = http.createServer(app)
/** Create socket connection */

// Construct a socket
const io = new Server(server)

// Bind the socket to your created http server.
global.io = io.listen(server)

global.io.on('connection', WebSockets.connection)

app.use(express.static(path.join(__dirname, '/build')))
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'build/index.html'))
)
