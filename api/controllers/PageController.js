/**
 * PageController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    showHomePage: function (req, res) {
        if (!req.session.userId) {
            return res.view('homepage', {
                me: null
            });
        }
        return showPage(req, res, 'homepage', function (me) {
            return res.redirect('/dashboard');
        });
    },

    showDashboardPage: function (req, res) {
        return showPage(req, res, function (me) {
            return res.view('dashboard', me);
        });
    },

    showOrdersPage: function (req, res) {
        return showPage(req, res, function (me) {
            return res.view('orders', me);
        });
    },

    showMakeOrderPage: function (req, res) {
        return showPage(req, res, function (me) {
            return res.view('makeorder', me);
        });
    },

    showCheckoutPage: function (req, res) {
        return showPage(req, res, function (me) {
            return res.view('checkout', me);
        });
    },

    showOrderItemPage: function (req, res) {
        var orderId = req.param('id');

        // Order exists, but check if user has their own order first,
        // redirect to that instead
        Order.findOne({ userId: req.session.userId }).exec(function (err, ownOrder) {
            if (err) return res.negotiate(err);

            // If they have their own order
            if (ownOrder) {
                if (req.param('id') == ownOrder.id) {
                    return showPage(req, res, function (me) {
                        return res.view('orderitem', {
                            me: me,
                            order: {
                                id: ownOrder.id,
                                userId: ownOrder.userId
                            }
                        });
                    });
                } else {
                    return res.redirect('/order/' + ownOrder.id);
                }
            }

            // This is not their own order, so check if order exists, before loading 
            // order on the orderitem page
            Order.findOne({ id: req.param('id') }).exec(function (err, order) {
                if (err) return res.negotiate(err);

                if (!order) return res.notFound();

                return showPage(req, res, function (me) {
                    return res.view('orderitem', {
                        me: me,
                        order: {
                            id: order.id,
                            userId: order.userId
                        }
                    });
                });
            });
        });
    },
    showSignupPage: function (req, res) {
        if (!req.session.userId) {
            return res.view('signup', {
                me: null
            });
        }
        return showPage(req, res, 'signup', function (me) {
            return res.redirect('/dashboard');
        });
    },
    showAdminPage: function (req, res) {
        User.findOne({ id: req.session.userId }).exec(function (err, user) {
            if (err) return res.negotiate(err);

            return res.view('admin', {
                me: {
                    id: user.id,
                    email: user.email,
                    admin: user.admin,
                }
            });
            
        });
    }

};

function showPage(req, res, cb) {

    User.findOne({ id: req.session.userId }).exec(function (err, user) {
        if (err) return res.negotiate(err);

        if (!user) {
            sails.log.verbose('Session refers to user who no longer exists');
            req.session.userId = null;
            return res.redirect('/');
        }

        // If it gets here, it's a real, existing user 
        cb({
            me: {
                id: user.id,
                email: user.email,
                admin: user.admin,
            }
        });

    });
}