module.exports = function (options) {

  options = options || {};
  options.login = options.login || "/login";

  // return is authenticated
  return function * (next) {

    // @todo: if it has jwt token, honors it, it should go directly to api
    // the priority: jwt then cookie

    var login = this.path == options.login;

    if (this.session.user) {

      if (login) {
        
        // get app root
        this.redirect ("/");

      } else {
        
        // @todo: check session's validity
        yield next;
      }

    } else {

      this.invalid = true; //it can be expired or simply a fresh request

      // @todo throw error, and push reload (if an api call)
      // this.throw (403);

      // if seeking for login page, send it to the right middleware
      if (this.path == options.login) {
        yield next;
      } else {
        // since this request doesn't have a valid session, then send it to login handler
        this.redirect (options.login);  
      }
    }
  };
}