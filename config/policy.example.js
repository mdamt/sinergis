var compose = require ("koa-compose");
var kasta = require ("kasta");

var apiMiddleware = function (accessLevel) {

  // a dummy middleware
  var a = function * (next) {
    // @todo: authorization check based on this.user.role and accessLevel
    console.log ("fort", accessLevel);

    yield next;
  }

  // another dummy middleware
  var b =  function * (next) {
    // if needed 
    // e.g check to db
    yield next;
  }

  // stack it up for composition
  var stack = [a, b];

  // return the composition
  return compose(stack);
}

// configurable list of avalilable roles and access levels
var config = {
  
  // predefined roles
  roles :[
    "public",
    "user",
    "admin"],

  // avalilable access levels
  accessLevels : {
    "public" : "*",
    "anonymous" : [ "public" ],
    "user" : [ "user", "admin" ],
    "admin" : [ "admin" ]
  }
}

var acl = kasta(config);

var policy = {

  // session keys, todo session options
  keys : ["test"],

  // build the access control list based on roles and access levels
  acl : acl,

  // jwt
  jwt : { secret : "secret", passthrough: false },

  // resources policy for Api
  api : {
    mount : "/api/1",
    fort : apiMiddleware,

    // configure each endpoint policy
    endpoints : {
      
      "users" : {
        "accessLevel"  : acl.accessLevels.admin
      },

      "letters" : {
        "accessLevel"  : acl.accessLevels.user
      }
    }
  },

  // routes policy for App
  app :  {
    endpoints : {

      "/login" : {
        "accessLevel"  : acl.accessLevels.anonymous
      },

      "/private" : {
        "accessLevel"  : acl.accessLevels.user
      },

      "/admin" : {
        "accessLevel"  : acl.accessLevels.admin
      }
    }
  },

  // server
  server : {
    port : 3000
  },

  defaults : {
    accessLevels : acl.accessLevels.anonymous
  },

  // cookie
  cookie : {
    maxage : 1000 * 60  
    //secureProxy : true
  }    
}

module.exports = policy;