var policy = require (__dirname + "/config/policy");

var web = require (__dirname + "/web");
// var app = require ("./app"); // @todo move to npm module
// var api = require ("./api"); // @todo move to npm module

var session = require ("koa-session-store");
var koa = require ("koa");
var server = koa();

server.keys = policy.keys;

// server.use (session(policy));
// server.use (web(policy));

module.exports = server;