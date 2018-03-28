var assert = require('assert');
var request = require('supertest');
var Passwords = require('machinepack-passwords');

describe('User Controller :: ', function () {
    describe('POST /api/v1/user/signup :: ', function () {
        describe('When logged in :: ', function () {

            //Setup
            var agent;

            before(function (done) {

                var createTestUserAndAuthenticate = require('../utils/create-logged-in-user');

                agent = request.agent(sails.hooks.http.app);

                createTestUserAndAuthenticate(agent, done);

            });

            //Test
            it('should return a 403 response code', function (done) {
                agent
                    .post('/api/v1/user/signup')
                    .send({
                        email: 'foo@foo.com',
                        password: 'rumpupupum'
                    })
                    .set('Content-Type', 'application/json')
                    .end(function (err, res) {
                        if (err) { return done(err); }

                        assert.equal(res.statusCode, 403);

                        return done();
                    });
            }); // it() should return a 403 response code


        }); // describe() When logged in

        describe('When logged out :: ', function () {
            describe('With an invalid email address :: ', function () {
                it('should return a 400 status code when missing', function (done) {
                    request(sails.hooks.http.app)
                        .post('/api/v1/user/signup')
                        .send({
                            username: '123456'
                        })
                        .set('Content-Type', 'application/json')
                        .end(function (err, res) {
                            if (err) { return done(err); }

                            assert.equal(res.statusCode, 400);

                            return done();
                        });
                }); // it() should return a 400 status code when missing

            }); // describe() With an invalid email address

            describe('With valid login credentials :: ', function () {
                var userResponse;
                before(function(done) {
                    request(sails.hooks.http.app)
                        .post('/api/v1/user/signup')
                        .send({
                            email: 'real@email.com',
                            password: '123456'
                        })
                        .set('Content-Type', 'application/json')
                        .end(function (err, res) {
                            if (err) { return done(err); }
                            // console.log('res.statusCode ' + res.statusCode)
                            // console.log('res ' + JSON.stringify(res));
                            // console.log('err ' + err);
                            userResponse = res;

                            return done();
                        });
                });
                

                it('should return a 200 status code', function (done) {
                    assert.equal(userResponse.statusCode, 200);  
                    return done();                  
                }); 

                it('should return the username of the user in the response body', function (done) {
                    assert.equal(userResponse.body.email, 'real@email.com');      
                    return done();              
                }); // it() should return a 200 status code

            }); // describe() With valid login credentials

        }); // describe() When logged out
    }); // describe() POST /api/v1/user/signup
}); // describe() User Controller