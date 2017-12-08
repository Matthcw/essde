/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    find: function (req, res) {
        sails.log.debug(`OrderController.find() {UserId:${req.session.userId}}`);                                                          
        // When ordering or delivering the only order they can find is their own
        // If they have an order, go to that, if they don't, go to any order
        Order.findOne({ or: [
            {userId: req.session.userId}, 
            {deliverUserId: req.session.userId} 
        ]}).exec(function (err, order) {
            if (err) return res.negotiate(err);

            if (order) {
                // User has made an order  
                if(order.userId == req.session.userId) {
                    sails.log.debug(`user is ordering order {UserId:${req.session.userId}, OrderId:${order.userId}}`);                                                                          
                } else {
                    sails.log.debug(`user is delivering order {UserId:${req.session.userId}, OrderId:${order.userId}}`);                                                                                              
                }        
                return res.json(order);
            } else {
                // User has no order
                if (req.param('id')) {
                    // Never returns one order ??? this wouldn't really be used                   
                    Order.findOne({ id: req.param('id') }).exec(function (err, otherOrder) {
                        if (err) return res.negotiate(err);
                        sails.log.debug(`user has no order or delivery, return this one order {UserId:${req.session.userId}, OrderId:${otherOrder.id} }`);                                                                                              
                        return res.json(otherOrder);
                    });
                } else {
                    // Only retrive orders that aren't currently being delivered
                    Order.find({deliverUserId: null}).exec(function (err, otherOrder) {
                        if (err) return res.negotiate(err);
                        sails.log.debug(`user has no order or delivery return all open orders {UserId:${req.session.userId}}`);                                                                                                                                      
                        return res.json(otherOrder);
                    });
                }

            }

        });
    },

    create: function (req, res) {
        sails.log.debug(`OrderController.create() {UserId:${req.session.userId}} `);                                                                  

        /* isNotOrdering Policy */
        /* isNotDelivering Policy */

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
        sails.log.debug(`OrderController.destroy() {UserId:${req.session.userId}} `);                                                                          
        
        OrderService.deleteOrder({req: req, res: res});
    }
};
