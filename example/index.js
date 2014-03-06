var server = require (__dirname + "/../");
var app = require ("./app");
var api = require ("./api");

server.use (app());
server.use (api());

server.listen (3000);

console.log ("running an example server on 3000 ~> " + process.env.NODE_ENV);