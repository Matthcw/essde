/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    find: function (req, res) {
        sails.log.debug(`UserId=${req.session.userId} is in OrderController.find()`);                                                          
        // When ordering the only order they can find is their own
        // If they have an order, go to that, if they don't, go to any order
        Order.findOne({ userId: req.session.userId }).exec(function (err, order) {
            if (err) return res.negotiate(err);

            if (order) {
                // User has made an order              
                return res.json(order);
            } else {
                // User has no order
                if (req.param('id')) {
                    Order.findOne({ id: req.param('id') }).exec(function (err, otherOrder) {
                        if (err) return res.negotiate(err);
                        return res.json(otherOrder);
                    });
                } else {
                    // Only retrive orders that aren't currently being delivered
                    Order.find({deliverUserId: null}).exec(function (err, otherOrder) {
                        if (err) return res.negotiate(err);
                        return res.json(otherOrder);
                    });
                }

            }

        });
    },

    create: function (req, res) {
        sails.log.debug(`UserId=${req.session.userId} is in OrderController.create()`);

        /* isNotOrdering Policy */

        Order.create({
            price: req.param('price'),
            items: req.param('items'),
            location_lat: req.param('location_lat'),
            location_lng: req.param('location_lng'),
            userId: req.session.userId
        }).exec(function (err, order) {
            if (err) return res.negotiate(err);
            sails.log.debug(`create new order {OrderId:${order.id}, UserId:${req.session.userId}}`);                                              
            return res.json(order);
        });


    },

    destroy: function (req, res) {  
        sails.log.debug(`UserId=${req.session.userId} is in OrderController.destroy()`);                                          
        
        Order.findOne({ id: req.param('id') }).exec(function (err, order) {
            if (err) return res.negotiate(err);
            if (!order) return res.notFound();

            // If this order was made by the user, delete it
            if(order.userId == req.session.userId) {
                sails.log.debug(`delete own order {OrderId:${order.id}, UserId:${req.session.userId}}`);                                              
                Order.destroy({
                    id: req.param('id'),
                    userId: req.session.userId
                }).exec(function (err, orderItems) {
                    if (err) return res.negotiate(err);
                    sails.log.debug(`delete own order successful {OrderId:${order.id}, UserId:${req.session.userId}}`);                                              
                
                    return res.json(orderItems);
                });
            }

            // If this was made by the delivering user just clear them from delivery 
            if(order.deliverUserId == req.session.userId) {
                sails.log.debug(`delete delivery user from order {OrderId:${order.id}, UserId:${req.session.userId}}`);                                              
                
                Order.update({
                    deliverUserId: req.session.userId
                }, {
                    deliverUserId: null
                }).exec(function(err, updatedOrder) {
                    if (err) return res.negotiate(err);
                    sails.log.debug(`delete delivery user successful {OrderId:${order.id}, UserId:${req.session.userId}}`);                                              
                    
                    return res.json(updatedOrder);
                });
            }

            // This delete request was made by neither the order user or delivery user
            sails.log.debug(`user not allowed to delete order {OrderId:${order.id}, UserId:${req.session.userId}}`);                                              
            return res.forbidden('You are not permitted to perform this action.');            
        });
       

        
    }
};
