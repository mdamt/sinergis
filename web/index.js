
/**
 * Module dependencies.
 */

var render = require ("./lib/render");
var compose = require ("koa-compose");
var thunkify = require ("thunkify");
var door = require ("./lib/door");
var parse = require ("co-body");

// models
var User = require ("./models/user");
var get = thunkify(User.get);

// router class
var Router = require ("koa-router");

module.exports = function (policy) {
  
  var router = new Router();

  router.get("/login", function * (next) {
    if (this.session.user) {
      this.redirect("/");
    } else {
      this.body = yield render ("index");  
    }
  });

  router.post("/login", function * (next) {

    try {

      // @todo: check to database via user model, user model can fetch the data directly from db or api
      var body = yield parse(this, { limit: '1kb' });
      var user = yield get(body.username);

      if (user.password == body.password) {
        this.session.user = user.id;
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

  return compose ([router.middleware(), door()]);
}
