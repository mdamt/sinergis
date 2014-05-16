var koa = require ("koa");
var mount = require ("koa-mount");
var request = require ("hyperquest");

module.exports = function (options, cb) {

  options = options || { mock : true};
  var policy = options.policy || {};
  var app = policy.app || {};
  var auth = app.auth || {};
  var api = policy.api || {};
  var server = policy.server || {};

  var host = api.uri || server.uri || "http://127.0.0.1";
  var port = api.port || server.port || 3000;
  var url = host.concat(":", port);

  var credential = {};
  var local = auth.local || {};
  var login = local.path || "/api/1/account/login";
  var headers = local.headers || {
    "Content-Type" : "application/json"
  };
  credential[local.username || "username"] = options.username;
  credential[local.password || "password"] = options.password;

  if (options.mock) {
    return cb(null, { email : "cumi@asam.com", roles : ["user", "letter"]});
  }

  var data = {
    url : url + login,
    body : JSON.stringify(credential),
    headers: headers
  };

  // the resulted data should be like following object:
  /*var data = {
    url : "http://localhost:3000/api/1/account/login",
    body : JSON.stringify({ "email": "japra@jamkrindo.com", "password" : "test12345" }),
    headers: {
      "Content-Type" : "application/json"
    }
  };*/

  // using the infamous hyperquest!
  var r = request.post(data.url, { headers : { "Content-Type" : "application/json"}});
  r.end(data.body);
  var body = "";
  var success = true;
  r.on("error", function(res){
    cb(new Error("system error"));
  });
  r.on("response", function(res){
    success = res.statusCode == 200;
  });
  r.on("data", function (buf) { body += buf; });
  r.on("end", function () {
    try {
      var obj = JSON.parse(body);
      if (!success) return cb(obj);
      return cb (null, obj);
    } catch (err) {
      cb (err);
    }
  });
}
