/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Emailaddresses = require('machinepack-emailaddresses');
var Passwords = require('machinepack-passwords');
var Mailgun = require('machinepack-mailgun');

module.exports = {
    signup: function (req, res) {
        if (_.isUndefined(req.param('email'))) {
            return res.badRequest('An email address is required!');
        }
        if (_.isUndefined(req.param('password'))) {
            return res.badRequest('A password is required!');
        }
        if (req.param('password').length < 6) {
            return res.badRequest('Password must be at least 6 characters!');
        }

        Mailgun.sendPlaintextEmail({
            apiKey: sails.config.mailgun.apiKey,
            domain: sails.config.mailgun.domain,
            toEmail: 'matthcw@hotmail.co.uk',
            subject: 'Account Confirmation',
            message: 'Account Confirmation Email',
            fromEmail: 'admin@essde.co.uk',
            fromName: 'admin@essde.co.uk',
        }).exec({
            error: function (err) {
                if (err) return res.negotiate(err);
                console.log(err);
            },
            success: function () {
                return res.ok();
            }
        });


        Emailaddresses.validate({
            string: req.param('email')
        }).exec({
            error: function (err) { return res.serverError(err); },
            invalid: function (err) { return res.badRequest('A valid email address is required!'); },
            success: function (err) {

                Passwords.encryptPassword({
                    password: req.param('password')
                }).exec({
                    error: function (err) { return res.serverError(err); },
                    success: function (result) {

                        User.create({
                            email: req.param('email'),
                            password: result
                        }).exec(function (err, createdUser) {
                            if (err) {

                                if (err.invalidAttributes && err.invalidAttributes.email &&
                                    err.invalidAttributes.email[0] &&
                                    err.invalidAttributes.email[0].rule === 'unique') {
                                    return res.alreadyInUse(err);
                                }

                                return res.negotiate(err);
                            }

                            req.session.userId = createdUser.id;
                            return res.json(createdUser);
                        });
                    }
                });
            },
        });
    },

    profile: function (req, res) {

        // User.findOne({ id: req.param('id') }).exec(function (err, user) {
        //     if (err) return res.negotiate(err);

        //     if (!user) return res.notFound();

        //     return res.json({
        //         email: user.email,
        //         admin: user.admin,
        //         deleted: user.deleted,
        //         banned: user.banned,
        //         id: user.id
        //     });
        // });
    },

    delete: function (req, res) {
        // if(!req.param('id')) return res.badRequest('`id` is a required parameter.');

        // User.destroy({
        //     id: req.param('id')}
        // ).exec(function (err, userDestroyed){
        //     if(err) return res.negotiate(err);
        //     if(userDestroyed.length === 0) return res.notFound();
        //     return res.ok();
        // });
    },

    remove: function (req, res) {
        // if(!req.param('id')) return res.badRequest('`id` is a required parameter.');

        // User.update({
        //     id: req.param('id')
        // },{
        //     deleted: true
        // }).exec(function (err, userUpdated){
        //     if(err) return res.negotiate(err);
        //     if(userUpdated.length === 0) return res.notFound();
        //     req.session.userId = null;
        //     return res.ok();
        // });
    },

    restore: function (req, res) {
        // if(!req.param('id')) return res.badRequest('`id` is a required parameter.');

        // User.update({
        //     id: req.param('id')
        // },{
        //     deleted: false
        // }).exec(function (err, userUpdated){
        //     if(err) return res.negotiate(err);
        //     if(userUpdated.length === 0) return res.notFound();
        //     req.session.userId = userUpdated.id;
        //     return res.ok();
        // });
    },

    updateAdmin: function (req, res) {
        if (!req.param('id')) return res.badRequest('`id` is a required parameter.');

        User.update({
            id: req.param('id')
        }, {
                admin: req.param('admin')
            }).exec(function (err, userUpdated) {
                if (err) return res.negotiate(err);
                if (userUpdated.length === 0) return res.notFound();
                return res.ok();
            });
    },

    updateBanned: function (req, res) {
        if (!req.param('id')) return res.badRequest('`id` is a required parameter.');

        User.update({
            id: req.param('id')
        }, {
                banned: req.param('banned')
            }).exec(function (err, userUpdated) {
                if (err) return res.negotiate(err);
                if (userUpdated.length === 0) return res.notFound();
                return res.ok();
            });
    },

    updateDeleted: function (req, res) {
        if (!req.param('id')) return res.badRequest('`id` is a required parameter.');

        User.update({
            id: req.param('id')
        }, {
                deleted: req.param('deleted')
            }).exec(function (err, userUpdated) {
                if (err) return res.negotiate(err);
                if (userUpdated.length === 0) return res.notFound();
                return res.ok();
            });
    },

    login: function (req, res) {

        if (_.isUndefined(req.param('email'))) {
            return res.badRequest('An email address is required!');
        }
        if (_.isUndefined(req.param('password'))) {
            return res.badRequest('A password is required!');
        }

        User.findOne({ email: req.param('email') }).exec(function (err, userFound) {
            if (err) return res.negotiate(err);
            if (!userFound) return res.notFound();

            Passwords.checkPassword({
                passwordAttempt: req.param('password'),
                encryptedPassword: userFound.password
            }).exec({
                error: function (err) {
                    if (err) return res.negotiate(err);
                },
                incorrect: function () {
                    return res.notFound();
                },
                success: function () {
                    if (userFound.deleted) return res.forbidden("Your account has been deleted.");
                    if (userFound.banned) return res.forbidden("You've been banned.");
                    sails.log.debug('Logged in userID:' + userFound.id);
                    req.session.userId = User.mongo.objectId(userFound.id);

                    // Clear any orders they made but were never completed
                    Order.update({ userId: userFound.id }, { deleted: true }).exec(function (err, order) {
                        if (err) return res.negotiate(err);
                    });
                    // Clear any orders they were delivering but were never completed
                    Order.update({ deliverUserId: userFound.id }, { deliverUserId: null }).exec(function (err, order) {
                        if (err) return res.negotiate(err);
                    });

                    return res.ok();
                }
            })

        })
    },

    logout: function (req, res) {

        User.findOne({ id: req.session.userId }).exec(function (err, user) {
            if (err) res.negotiate(err);
            if (!user) sails.log.verbose('Session refers to a user who no longer exists');

            req.session.userId = null;

            // TODO: Use the deleteOrder service instead of this
            // Clear any orders they made but were never completed            
            Order.update({ userId: user.id }, { deleted: true }).exec(function (err, order) {
                if (err) return res.negotiate(err);
            });
            // Clear any orders they were delivering but were never completed
            Order.update({ deliverUserId: user.id }, { deliverUserId: null }).exec(function (err, order) {
                if (err) return res.negotiate(err);
            });

            res.redirect('/');
        });

    },

    adminUsers: function (req, res) {
        User.find({ admin: true }).exec(function (err, usersFound) {
            if (err) return res.negotiate(err);

            return res.json(usersFound);
        })
    }

};

