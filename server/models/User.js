var User,
    _ = require('underscore'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    check = require('validator').check,
    userRoles = require('../../client/js/routingConfig').userRoles;

var users = [
  {
    id: 1,
    username: "user",
    password: "123",
    passwordrepeat: "123",
    role: userRoles.user
  },
  {
    id: 2,
    username: "testli",
    password: "testli",
    passwordrepeat: "testli",
    role: userRoles.user
  }
];

module.exports = {
  addUser: function (username, password, passwordrepeat, role, callback) {
    if (this.findByUsername(username) !== undefined)  return callback("UserAlreadyExists");

    var user = {
      id: _.max(users,function (user) {
        return user.id;
      }).id + 1,
      username: username,
      password: password,
      passwordrepeat: passwordrepeat,
      role: role
    };
    users.push(user);
    callback(null, user);
  },

  findAll: function () {
    return _.map(users, function (user) {
      return _.clone(user);
    });
  },

  findById: function (id) {
    return _.clone(_.find(users, function (user) {
      return user.id === id
    }));
  },

  findByUsername: function (username) {
    return _.clone(_.find(users, function (user) {
      return user.username === username;
    }));
  },

  validate: function (user) {
    check(user.username, 'Username must be 1-20 characters long').len(1, 20);
    check(user.password, 'Password must be 5-60 characters long').len(5, 60);
    check(user.password, 'Password doesnt match').equals(user.passwordrepeat);
    check(user.username, 'Invalid username').not(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);

    var stringArr = _.map(_.values(userRoles), function (val) {
      return val.toString()
    });
    check(user.role, 'Invalid user role given').isIn(stringArr);
  },

  localStrategy: new LocalStrategy(
      function (username, password, done) {

        var user = module.exports.findByUsername(username);

        if (!user) {
          done(null, false, { message: 'Incorrect username.' });
        }
        else if (user.password != password) {
          done(null, false, { message: 'Incorrect username.' });
        }
        else {
          return done(null, user);
        }

      }
  ),
  serializeUser: function (user, done) {
    done(null, user.id);
  },

  deserializeUser: function (id, done) {
    var user = module.exports.findById(id);

    if (user) {
      done(null, user);
    }
    else {
      done(null, false);
    }
  }
};
