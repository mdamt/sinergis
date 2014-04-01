/**
 * Module dependencies.
 */
var render = require ("./lib/render");
var compose = require ("koa-compose");
var thunkify = require ("thunkify");
var door = require ("./lib/door");
var parse = require ("co-body");
var fs = require ("fs");
var path = require ("path");
var auth = require ("./lib/auth");

// router class
var Router = require ("koa-router");

module.exports = function (policy) {

  policy = policy || {};

  var router = new Router();
  var app = policy.app || {};
  var dir = app.path + "/views";
  var login = policy.login ? (path.extname (policy.login) ? policy.login : (policy.login + ".html")) : "login.html";
  var overridden = fs.existsSync (dir + "/" + login);

  var authenticate = thunkify(auth);

  router.get("/login", function * (next) {
    if (this.session.user) {
      this.redirect("/");
    } else {
      if (overridden) {
        this.body = yield render(dir)("login");  
      } else {
        this.body = yield render()("index");    
      }
    }
  });

  router.post("/login", function * (next) {
    try {
      // @todo: check to database via user model, user model can fetch the data directly from db or api
      var body = yield parse(this, { limit: '1kb' });

      var options = {
        username : body.username,
        password : body.password,
        policy : policy,
        mock : false
      }

      var user = yield authenticate(options);

      if (user) {
        this.session.user = user;
        // this.session.jwt = 
        // this.session.sid = 
        this.redirect("/");

      } else {
        this.session = null;
        this.redirect("/login");
      }

    } catch (err) {
      console.log (err);
      this.redirect("/login");
    }
  });

  router.all("/logout", function * (next) {
    this.session = null;
    this.redirect("/login");
  });

  return compose ([router.middleware(), door(policy)]);
}
