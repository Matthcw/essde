/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  var Passwords = require('machinepack-passwords');

  User.findOne({
    email: 'admin@gmail.com'
  }).exec(function (err, userFound) {
    if (userFound) {
      return cb();
    } else {

      Passwords.encryptPassword({
        password: '111111'
      }).exec({
        error: function (err) { console.log("2"); return cb(err) },
        success: function (encryptedPassword) {

          User.create([{
            email: 'admin@gmail.com',
            password: encryptedPassword,
            admin: true
          }, {
            email: 'phone@gmail.com',
            password: encryptedPassword,
            admin: false
          }, {
            email: 'user@gmail.com',
            password: encryptedPassword,
            admin: false
          }]).exec(function (err, createdUser) {
            if (err) {
              return cb(err);
            }
            return cb();
          });
        }
      });

    }
  });


};
