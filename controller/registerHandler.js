
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

module.exports = {whRegisterHandler, whRegisteredResponseHandler}