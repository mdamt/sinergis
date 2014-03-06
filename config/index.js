var policy = require ("./policy");

module.exports = function (options) {
  return function * (next) {
    this.policy = policy;
    yield next;
  }
}