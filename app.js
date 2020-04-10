const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')

const DEFAULT_WEBHOOK_LIFETIME = 60 //seconds
const CALLS_LIMIT = null //seconds

var config = {
  host: 'localhost',
  port: 4003,
  timeout: DEFAULT_WEBHOOK_LIFETIME * 1000,
  callsLimit: CALLS_LIMIT,
  verbose: true
}
var started = false

const whStore = {}

app.use(bodyParser.json())


/**
 * JUST STATUS OK
 * ----------
 *
 * Response just Status 200 if OK
 *
 * Use Cases:
 * - To receive information without a response to client
 *
 */

 /**
 * Eco same respose to client
 * @param {*} req require data from client
 * @param {*} res response to client
 */
const okHandler = (req, res) => {
  console.log(req)
  res.sendStatus(200)
}

app.get('/', okHandler)
app.post('/', okHandler)

/**
 * LOG
 * ----------
 *
 * To receive log.
 * Appends a Date to every req.body
 *
 * Use Cases:
 * - To receive log
 *
 */

 /**
 * Eco same respose to client
 * @param {*} req require data from client
 * @param {*} res response to client
 */
const logHandler = (req, res) => {
  console.log(`${new Date()} -->`)
  console.log(req.headers.host)
  console.log(req.body)
  res.sendStatus(200)
}

app.get('/log', logHandler)
app.post('/log', logHandler)


/**
 * LOG
 * ----------
 *
 * To receive log.
 * Appends a Date to every req.body
 *
 * Use Cases:
 * - To receive log
 *
 */

 /**
 * Eco same respose to client
 * @param {*} req require data from client
 * @param {*} res response to client
 */
const logFileHandler = (req, res) => {
  let dir = __dirname + "/log/"
  let filename = req.headers.host + "_" + new Date().toISOString() + ".log"
  let logFile = dir + filename

  // verifica que la carpeta esté creada
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  console.log(`Write data from ${req.headers.host} to ${logFile}`)
  fs.writeFile(logFile,  JSON.stringify(req.body, null, 4)  , function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
  });
  res.sendStatus(200)
}

app.get('/logFile', logFileHandler)
app.post('/logFile', logFileHandler)


/**
 * ECHO MODEL
 * ----------
 *
 * Response same data received from client
 * Use Cases:
 * - Verify in same client data received in server
 *
 */

/**
 * Eco same respose to client
 * @param {*} req require data from client
 * @param {*} res response to client
 */
const echoHandler = (req, res) => {
  if (config.verbose) console.log(`message echo to client`)
  res.status(200).send(req.body)
}

app.get('/echo', echoHandler)
app.post('/echo', echoHandler)

/**
 * Registered MODEL
 * ----------
 *
 * Creates (register) webhooks before used.
 *
 * Use cases examples:
 * - Create dinamically webhooks
 * - Set some restrictions in data received
 * - Avoid saturate server test with big connections received
 * - Avoid keep connections open.
 *
 */

 /**
  * Register a new webhook
  *
  * @param {*} req require data from client
  * @param {*} res response to client
  */
const whRegisterHandler = (req, res) => {
  //parmeters set
  const whid = req.params.whid
  const timeout = req.params.whtimeout * 1000 || config.timeout
  const callsLimit = req.params.whcallsLimit || config.callsLimit


  if(whStore[whid]) {
    const message = `Webhook id ${whid} already used and still pending`
    if (config.verbose) console.log(message)
    res.status(400).send(message)
  } else {

    // set messaje for debug and response
    const message = `Webhook ${whid} registered.`+
      `\nThis webhook will stay live for ${timeout} seconds`+
      `\nand a limit of ${(callsLimit !==null)?callsLimit:'unlimited'} calls.`+
      `\nWaiting to be called on...`+
      `\nhttp://${config.host}:${config.port}/webhook/${whid}`

    if (config.verbose) console.log(message)

    res.status(200).send(message)

    const timeoutId = setTimeout(function() {
      if (config.verbose) console.log(`Webhook ${whid} timed out after ${timeout}`)
      delete whStore[whid]
    }, timeout)

    whStore[whid] = {
      res,
      timeoutId,
      callsLimit
    }
  }
}

const whRegisteredResponseHandler = (req, res) => {
  const whid = req.params.whid
  const wh = whStore[whid]
  if (wh) {
    if(whStore[whid].callsLimit !== null && --whStore[whid].callsLimit === 0) {
      delete whStore[whid]
      clearTimeout(wh.timeoutId)
    }
    const payload = req.body || {}
    if (config.verbose) console.log(`Webhook ${whid} just got called, sending the payload back`, payload)
    res.status(200).send(payload)
  }
  else {
    if (config.verbose) console.log(`Webhook ${whid} just got called but could not be found`)
    res.sendStatus(404)
  }
}

app.get('/register/:whid/', whRegisterHandler)
app.get('/register/:whid/:whtimeout', whRegisterHandler)
app.get('/register/:whid/:whtimeout/:whcallsLimit', whRegisterHandler)
app.get('/webhook/:whid', whRegisteredResponseHandler)
app.post('/webhook/:whid', whRegisteredResponseHandler)


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
