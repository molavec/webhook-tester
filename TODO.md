* Registros permanentes
* tester con jest
* eliminar webhook




Tests

curl -X GET "http://localhost:4003/register/004"

curl --request POST -H "Content-Type: application/json" \
  --data '{"username":"xyz","password":"xyz"}' \
  "http://localhost:4003/webhooks/004"
