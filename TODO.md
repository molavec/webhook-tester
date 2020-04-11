* Simplificar el README.md
* Mejorar los test con jest
* Automatizar subida del README.md a Docker
* Crear una interfaz gráfica para gestión de los webhook
* eliminar webhook
* Crear un modulo global con NPM

Tests

curl -X GET "http://localhost:4003/register/004"

curl --request POST -H "Content-Type: application/json" \
  --data '{"username":"xyz","password":"xyz"}' \
  "http://localhost:4003/webhooks/004"
