const fs = require('fs')
const path = require('path')

/**
 * Log output in file.
 * @param {*} req require data from client
 * @param {*} res response to client
 */
const logFileHandler = (req, res) => {
  let dir = path.resolve(__dirname, '../log/')
  console.log(dir)
  let filename = req.headers.host + "_" + new Date().toISOString() + ".log"
  let logFile = dir + path.sep +  filename
  console.log(logFile)

  // verifica que la carpeta esté creada
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  console.log(`### --> \n${logFile}`)
  fs.writeFile(logFile,  JSON.stringify(req.body, null, 4)  , function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
  });
  res.sendStatus(200)
}

module.exports = logFileHandler
