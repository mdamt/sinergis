var koa = require ("koa");
var Router = require ("koa-router");
var router = new Router ();

module.exports = function (policy){
  router.get ("/api/1/users", function * (next){
    this.body = ["badu", "budi", "wati"];
  });

  return {
    mount : router.middleware(),
    path : __dirname,
    type : "api"
  }
}
