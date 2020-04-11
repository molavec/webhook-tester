/**
 * Eco same respose to client
 * @param {*} req require data from client
 * @param {*} res response to client
 */
const echoHandler = (req, res) => {
  if (req.config.verbose) console.log(`message echo to client`)
  res.status(200).send(req.body)
}

module.exports = echoHandler