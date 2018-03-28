var request = require('supertest');
var Passwords = require('machinepack-passwords');
var USER_FIXTURE = require('../fixtures/user');

module.exports = function(agent, cb) {
    Passwords.encryptPassword({
        password: USER_FIXTURE.password
    })
    .exec({
        error: cb,
        success: function(password) {
            User.create({
                email: USER_FIXTURE.email,
                password: password
            })
            .exec(function(err, user) {
                if(err) { return cb(err); }

                agent
                .put('/login')
                .send({
                    email: USER_FIXTURE.email,
                    password: USER_FIXTURE.password
                })
                .set('Content-Type', 'application/json')
                .end(function(err, res) {
                    if(err) { return cb(err); }
                    //console.log('res.status', res.status);
                    //console.log('res.body', res.body);
                    return cb();
                });
            });
        }
    });
}