const express = require('express')
const app = express()
const bodyParser = require('body-parser')


const logHandler = require('./controller/logHandler')
const logFileHandler = require('./controller/logFileHandler')
const echoHandler = require('./controller/echoHandler')
const {whRegisterHandler, whRegisteredResponseHandler} = require('./controller/registerHandler')

const DEFAULT_WEBHOOK_LIFETIME = 60 //seconds
const CALLS_LIMIT = null //seconds

var config = {
  host: 'localhost',
  port: 4003,
  timeout: DEFAULT_WEBHOOK_LIFETIME * 1000,
  callsLimit: CALLS_LIMIT,
  verbose: true,
  prettyOutput: true
}

let started = false
const whStore = {}

// Prepare server
app.use(bodyParser.json())
app.use((req, res, next)=>{
  req.config = config
  next()
})

/**
 * LOG: Date, Host and body.
 * ----------
 */
app.get('/', logHandler)
app.post('/', logHandler)

/**
 * LOG: Date, Host and body in separate file.
 * ----------
 */
app.get('/logFile', logFileHandler)
app.post('/logFile', logFileHandler)


/**
 * ECHO: Response same data received from client
 * ----------
 */
app.get('/echo', echoHandler)
app.post('/echo', echoHandler)

/**
 * WEBHOOK REGISTER: Creates API dinamically.
 * ----------
 */
app.get('/register/:whid/', whRegisterHandler)
app.get('/register/:whid/:whtimeout', whRegisterHandler)
app.get('/register/:whid/:whtimeout/:whcallsLimit', whRegisterHandler)
app.get('/webhook/:whid', whRegisteredResponseHandler)
app.post('/webhook/:whid', whRegisteredResponseHandler)

/**
 * Start Server
 * ----------
 */
const start = (done) => {
  const callback = () => {
    if (done) {
      const baseUrl = `http://${config.host}:${config.port}/`
      done({
        webhookBaseUrl: baseUrl + 'webhooks/',
        registerBaseUrl: baseUrl + 'register/'
      })
    }
  }

  if (started) {
    console.log(`Webhook tester app was already running on port ${config.port}!`)
    callback()
  }
  else {
    app.listen(config.port, function() {
      console.log(`Webhook tester app listening on port ${config.port}!`)
      started = true
      callback()
    })
  }
}

if (require.main === module) {
  console.log('Launching Webhook tester')
  start((urls) => {
    console.log(urls)
  })
}

module.exports = config
module.exports.start = start
