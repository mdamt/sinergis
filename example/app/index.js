var koa = require ("koa");
var render = require ("./render");
var serve = require ("koa-static");
var Router = require ("koa-router");
var mount = require ("koa-mount");

module.exports = function (policy){

  var router = new Router ();
  
  router.get ("/", function * (next){
    this.body = yield render ("index", { test : "From Server" });
  });

  var app = koa();
  app.use (serve (__dirname + "/dist/public"));
  app.use (router.middleware());

  return mount(app);
}
