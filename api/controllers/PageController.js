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
        return showPage(req, res, function (me) {
            return res.redirect('/dashboard');
        });
    },

    showDashboardPage: function (req, res) {
        return showPage(req, res, function (me) {
            return res.view('dashboard', { me: me });
        });
    },

    showOrdersPage: function (req, res) {
        return showPage(req, res, function (me) {
            return res.view('orders', { me: me });
        });
    },

    showMakeOrderPage: function (req, res) {
        return showPage(req, res, function (me) {
            return res.view('makeorder', { me: me });
        });
    },

    showCheckoutPage: function (req, res) {
        return showPage(req, res, function (me) {
            return res.view('checkout', { me: me });
        });
    },

    showOrderItemPage: function (req, res) {
        sails.log.debug(`UserId=${req.session.userId} is in PageController.showOrderItemPage()`);

        User.findOne({
            id: req.session.userId
        }).exec(function (err, foundUser) {
            if (err) return res.negotiate;
            if (!foundUser) return res.notFound();
            // Check if user has their own order/delivery first,
            // redirect to that instead
            Order.findOne({
                completed: false,
                deleted: false,
                or: [
                    { owner: foundUser.id },
                    { deliveringUser: foundUser.id }, /// Change this to check for your delivery OR order, if you have none, go back to /orders, you shouldnt be on this page otherwise
                ]
            }).exec(function (err, ownOrderOrDelivery) {
                if (err) return res.negotiate(err);

                checkIfUserHasOwnOrderOrDelivery(req, res, ownOrderOrDelivery, foundUser.id);
                
                if(ownOrderOrDelivery) return;

                sails.log.debug(`{UserId:${req.session.userId}} has not got their own order, search for this order in Order model`);

                checkIfOrderExists(req, res, order, foundUser.id);

            });
        });
    },

    showSignupPage: function (req, res) {
        if (!req.session.userId) {
            return res.view('signup', {
                me: null
            });
        }
        return showPage(req, res, function (me) {
            return res.redirect('/dashboard');
        });
    },
    showAdminPage: function (req, res) {
        User.findOne({ id: req.session.userId }).exec(function (err, user) {
            if (err) return res.negotiate(err);

            return showPage(req, res, function (me) {
                return res.view('admin', { me: me });
            });

        });
    }

};

function showPage(req, res, cb) {
    sails.log.debug('req.session.userId ' + req.session);
    //Find out why the session and database thing aren't matching
    User.findOne({ 
        id: req.session.userId 
    }).exec(function (err, user) {
        if (err) return res.negotiate(err);

        if (!user) {
            sails.log.verbose('Session refers to user who no longer exists');
            req.session.userId = null;
            return res.redirect('/');
        }

        // If it gets here, it's a real, existing user 
        cb({
            id: user.id,
            email: user.email,
            admin: user.admin,
        });

    });
}

function makeUserTheOrderDeliverer(req, res, orderId, foundUserId) {

    // There is currently no user delivering the order, set this user as the delivery user
    Order.update({ id: orderId }, { deliveringUser: foundUserId }).exec(function (err, updatedOrder) {
        if (err) return res.negotiate(err);
        
        updatedOrder = updatedOrder[0];
        // socket broadcast to room of: order.id, that a user has connected 
        sails.log.debug('socket broadcast: delivererjoined room: order' + updatedOrder.id);
        sails.sockets.broadcast('order' + updatedOrder.id, 'delivererjoined');
        sails.sockets.broadcast('vieworders', 'delivererassigned', updatedOrder.id);

        return showPage(req, res, function (me) {
            return res.view('orderitem', {
                me,
                order: {
                    id: updatedOrder.id,
                    userId: foundUserId
                }
            });
        });
    });

}

function checkIfUserHasOwnOrderOrDelivery(req, res, ownOrderOrDelivery, foundUserId) {

    // If they have their own order/delivery
    if (ownOrderOrDelivery) {
        sails.log.debug(`{UserId:${req.session.userId}} has their own order/delivery`);

        if (req.param('id') == ownOrderOrDelivery.id) {

            sails.log.debug(`{UserId:${req.session.userId}} is searching for their 
        own order/delivery via /order/${ownOrderOrDelivery.id}, return the view`);

            return showPage(req, res, function (me) {
                return res.view('orderitem', {
                    me,
                    order: {
                        id: ownOrderOrDelivery.id,
                        userId: foundUserId
                    }
                });
            });

        } else {
            sails.log.debug(`{UserId:${req.session.userId}} is not looking for their own order, 
        redirect to their own /order/${ownOrderOrDelivery.id}`);

            return res.redirect('/order/' + ownOrderOrDelivery.id);
        }
    }

}

function checkIfOrderExists(req, res, order, foundUserId) {

    // This is not their own order, so check if order exists, before loading 
    // order on the orderitem page
    Order.findOne({
        id: req.param('id'),
        completed: false,
        deleted: false,
    }).exec(function (err, order) {
        if (err) return res.negotiate(err);

        if (!order) {
            sails.log.debug(`{OrderId:${req.param('id')}} does not exist`);
            return res.notFound();
        }

        sails.log.debug(`{OrderId:${req.param('id')}} exists`);

        // If you get here, order exists 

        // If this order currently has a user delivering it, 
        if (order.deliveringUser) {
            // This order is being delivered by another user                        
            sails.log.debug(`{OrderId:${order.id}} is being delivered by another user, {UserId:${order.deliveringUser}} 
                        redirect to /orders`);
            return res.redirect('/orders')
        } else {
            sails.log.debug(`No one is delivering this order {Order:${order.id}},
                    make this user the delivering user {UserId:${req.session.userId}}`);
            makeUserTheOrderDeliverer(req, res, order.id, foundUserId);
        }
    });

}