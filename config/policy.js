var build = require (__dirname + "/../lib/acl");
var Router = require ("koa-router");
var compose = require ("koa-compose");

// For testing purpose
/*
var jwt = require('jsonwebtoken');

var user = {
  id : 123,
  role : 2 // user
};

var admin = {
  id : 123,
  role : 4 // admin
};

var userToken = jwt.sign(user, 'secret', { expiresInMinutes: 60*5 });
var adminToken = jwt.sign(admin, 'secret', { expiresInMinutes: 60*5 });
console.log (userToken);
console.log (adminToken);
*/

var router = new Router();

module.exports = (function () {

  // resources middleware for authentication, 
  // or any other necessary processes need to be executed before each endpoint
  // this is should be configurable, since the authorization checking depends on 
  // the opinion given to "session" means: token, cookie, or anything else 
  var apiMiddleware = function (accessLevel) {

    var a = function * (next) {
      
      // @todo: authorization check
      /*if (! this.user ) {
        this.throw (401);
      }

      if (! this.user.role ) {
        this.throw (403);
      }

      this.policy = policy;
      this.accessLevel = this.policy.accessLevel
      this.allowed = this.user.role & this.accessLevel.bitMask;

      if (!this.allowed) {
        this.throw (403);
      }*/

      console.log ("fort", accessLevel);

      yield next;

    }

    var b =  function * (next) {
      // if needed 
      // e.g check to db
      yield next;
    }

    var stack = [a, b];

    return compose(stack);
  }

  // configurable list of avalilable roles and access levels
  var config = {
    /**
     * list of roles 
     */
    roles :[
      "public",
      "user",
      "admin"],

    /**
     * access levels
     */
    accessLevels : {
      "public" : "*",
      "anonymous" : [ "public" ],
      "user" : [ "user", "admin" ],
      "admin" : [ "admin" ]
    }
  }

  var acl = build (config);

  // the policy for Api and App
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
      // ,secureProxy : true,
    }
    
    
  }

  return policy;

})();