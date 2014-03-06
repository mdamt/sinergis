module.exports = function (options) {

  options = options || {};
  options.login = options.login || "/login";

  // return is Authenticated
  return function * (next) {

    // @todo: if it has jwt token, honors it, it should go directly to api
    // the priority: jwt then cookie

    if (this.session.user) {
      // @todo: check session's validity
      yield next;

    } else {
      this.expired = true;
      // @todo throw error, and push reload (if an api call)
      // this.throw (403);
      this.redirect(options.login);
    }
  };
}