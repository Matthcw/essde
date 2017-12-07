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
            return res.view('dashboard', {me: me});
        });
    },

    showOrdersPage: function (req, res) {
        return showPage(req, res, function (me) {
            return res.view('orders', {me: me});
        });
    },

    showMakeOrderPage: function (req, res) {
        return showPage(req, res, function (me) {
            return res.view('makeorder', {me: me});
        });
    },

    showCheckoutPage: function (req, res) {
        return showPage(req, res, function (me) {
            return res.view('checkout', {me: me});
        });
    },

    showOrderItemPage: function (req, res) {
        sails.log.debug(`UserId=${req.session.userId} is in PageController.showOrderItemPage()`);                                  
        var orderId = req.param('id');

        // Check if user has their own order first,
        // redirect to that instead
        Order.findOne({ userId: req.session.userId }).exec(function (err, ownOrder) {
            if (err) return res.negotiate(err);

            // If they have their own order
            if (ownOrder) {
            sails.log.debug(`UserId=${req.session.userId} has their own order`);                                  
        
                if (req.param('id') == ownOrder.id) {

                    sails.log.debug(`UserId=${req.session.userId} is searching for their 
                    own order via /order/${ownOrder.id}, return the view`);  

                    return showPage(req, res, function (me) {
                        return res.view('orderitem', {
                            me,
                            order: {
                                id: ownOrder.id,
                                userId: ownOrder.userId
                            }
                        });
                    });
                    
                } else {

                    sails.log.debug(`UserId=${req.session.userId} is not looking for their own order, 
                    redirect to their own /order/${ownOrder.id}`); 

                    return res.redirect('/order/' + ownOrder.id);
                }
            }

            sails.log.debug(`UserId=${req.session.userId} has not got their own order, search for this order in Order model`);                                  
            
            // This is not their own order, so check if order exists, before loading 
            // order on the orderitem page
            Order.findOne({ id: req.param('id') }).exec(function (err, order) {
                if (err) return res.negotiate(err);

                if (!order) {
                    sails.log.debug(`OrderId=${req.param('id')} does not exist`);                                 
                    return res.notFound();
                }

                sails.log.debug(`OrderId=${req.param('id')} exists`);                                  
            
                // If you get here, order exists 

                // If this order currently has a user delivering it, 
                if(order.deliverUserId){
                    if(order.deliverUserId == req.session.userId){
                        // This order is being delivered by this user
                        sails.log.debug(`OrderId=${order.id} is being delivered by this user, UserId=${req.session.userId} 
                        display the view`); 
                        return showPage(req, res, function (me) {
                            return res.view('orderitem', {
                                me,
                                order: {
                                    id: order.id,
                                    userId: order.userId
                                }
                            });
                        });

                    } else {
                        // This order is being delivered by another user                        
                        sails.log.debug(`OrderId=${order.id} is being delivered by another user, UserId=${order.deliverUserId} 
                        redirect to /orders`);  
                        return res.redirect('/orders')                                                                        
                    }
                    
                }

                sails.log.debug(`No one is delivering this order (Order=${order.id}),
                 make this user the delivering user UserId=${req.session.userId}`);                                                                  
                // There is currently no user delivering the order, set this user as the delivery user
                Order.update(order, {deliverUserId: req.session.userId}).exec(function(err, updatedOrder) {
                    if (err) return res.negotiate(err);

                    return showPage(req, res, function (me) {
                        return res.view('orderitem', {
                            me,
                            order: {
                                id: order.id,
                                userId: order.userId
                            }
                        });
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
        return showPage(req, res, function (me) {
            return res.redirect('/dashboard');
        });
    },
    showAdminPage: function (req, res) {
        User.findOne({ id: req.session.userId }).exec(function (err, user) {
            if (err) return res.negotiate(err);

            return showPage(req, res, function (me) {
                return res.view('admin', {me: me});
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
                id: user.id,
                email: user.email,
                admin: user.admin,     
        });

    });
}