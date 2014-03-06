var users = [
  { id : "test", password : "test", username : "test"},
  { id : "test1", password : "test1", username : "test1"}
]

// @todo via api
var User = function () {
  return {
    get : function (id, cb){
      var i = users.length;
      while (i--) {
        var user = users[i];
        if (user && user.id == id) {
          return cb (null, user);
        }
      }
      cb (new Error ('Not Found'));
    }
  }
}

module.exports = User();
