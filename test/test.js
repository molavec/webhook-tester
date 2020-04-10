const webhookTester = require('../app')
webhookTester.start( (urls) => {
  console.log("I got called back", urls)
  //process.exit(0)
})
