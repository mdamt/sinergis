var sinergis = require (__dirname + "/../");
var policy = require (__dirname + "/../config/policy.example");
var app = require ("./app");
var api = require ("./api");

var server = sinergis(policy);

var stack = [];
stack.push (api(policy));
stack.push (app(policy));

server.mount (stack);

server.listen (3000);
console.log ("running an example server on 3000 ~> " + process.env.NODE_ENV);