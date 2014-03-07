var web = require (__dirname + "/web");
var session = require ("koa-session-store");
var koa = require ("koa");

module.exports = function (policy) {
  var server = koa();
  server.keys = policy.keys;
  server.use (session(policy));
  server.use (web(policy));
  return server;
}