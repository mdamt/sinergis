var koa = require ("koa");
var Router = require ("koa-router");
var router = new Router ();

module.exports = function (policy){
  router.get ("/api/1/users", function * (next){
    this.body = ["badu", "budi", "wati"];
  });
  return router.middleware();
}
