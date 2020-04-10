# webhook-tester
Simple express app to use for automated testing of webhooks.

# How to use

## Start in the terminal
`npm start`


### Just status OK
Response just Status 200 if OK

`GET http://localhost:4003/`
`POST http://localhost:4003/`

**Use Cases:**
* To receive information without a response to client

**Use example:**
```bash
curl --request POST \
  -H "Content-Type: application/json" \
  --data '{"username":"xyz","password":"xyz"}' \
  "http://localhost:4003/"
```

### Logs
Appends a Date to every req.body.

`GET http://localhost:4003/log`
`POST http://localhost:4003/log`

**Use Cases:**
* To receive log.


 **Use example:**
```bash
curl --request POST -H \
  "Content-Type: application/json" \
  --data '{"username":"xyz","password":"xyz"}' \
  "http://localhost:4003/log"
```


### Logs Files
Creates a file with **req.body** in **./log** directory

`GET http://localhost:4003/logFile`
`POST http://localhost:4003/logFile`

**Use Cases:**
* To save messages in files (use carefully)


 **Use example:**
```bash
curl --request POST -H \
  "Content-Type: application/json" \
  --data '{"username":"xyz","password":"xyz"}' \
  "http://localhost:4003/logFile"
```

### Echo model
Response same data received from client

`GET http://localhost:4003/echo`
`POST http://localhost:4003/echo`

**Use Cases:**
* Verify in same client data received in server


 **Use example:**
```bash
curl --request POST -H
  "Content-Type: application/json" \
  --data '{"username":"xyz","password":"xyz"}' \
  "http://localhost:4003/echo"
```

### Registering a webhook test


`GET http://localhost:4003/register/:webhook_id`

`GET http://localhost:4003/register/:webhook_id/:webhook_timeout`

`GET http://localhost:4003/register/:webhook_id/:webhook_timeout/:webhook_callsLimit`

where,
 * `:webhook_id` is a unique id you assign to this webhook.
 * `:webhook_timeout` timeout that webhook stay alive before it ends itself.
 * `:webhook_callsLimit` max calls permit before it ends itself.

This request will timeout after a maximum of a minute if the webhook is never called

### Use a webhook with your app API
The Webhook url that needs to be called to get a successful response from the above test registered is

`GET http://localhost:4003/webhooks/:webhook_id`
`POST http://localhost:4003/webhooks/:webhook_id`

where
* `:webhook_id` is the same unique id that you have registered above.

**Use Cases:**
* Create dinamically webhooks
* Set some restrictions in data received
* Avoid saturate server test with big connections received
* Avoid keep connections open.


### Start from tests or funtions
Use this package to test webhook calls that your app API is supposed to make. This usefull to require it in your tests.
A test sequence could be
 * register a webhook using your app API
 * register a webhook test on webhook-tester, this request will be pending
 * make a call to your API that is supposed to trigger the webhook call
 * the webhook test request will be called. If the webhook had a request body, you will get it as a response body


#### Require in your test files
You only need to start it once but it doesn't matter if you call start multiple times.

```javascript
const webhookTester = require('webhook-tester');
webhookTester.port = 4003; // Optional. 4003 is the default
webhookTester.timeout = 10000; // in ms. Optional. 10000 is the default
webhookTester.verbose = false, // Boolean. Optional. Defaults to true. If true logs every register and webhook call
webhookTester.start(); // Required. You can optionnally pass a function to get the register and call urls
```

## Dockerize

You can build a container using Dockerfile

```bash
docker build -t webhook-tester .
```

You can execute `webhook-tester` using docker-compose.yml

```bash
docker-compose up
```