/**
 * Prints logs in console
 * @param {*} req require data from client
 * @param {*} res response to client
 */
const logHandler = (req, res) => {
  console.log(`###
  --> ${new Date()} <--
  ${req.headers.host}`);

  //check si prettyOutput is true
  (req.config.prettyOutput) ? console.log(JSON.stringify(req.body, null, 4)) : console.log(req.body);

  res.sendStatus(200)
}

module.exports = logHandler