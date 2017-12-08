module.exports = {

    findOrders: function (options, done) {
        const req = options.req;
        const res = options.res;
        
        // When ordering or delivering the only order they can find is their own
        // If they have an order, go to that, if they don't, go to any order
        Order.findOne({
            or: [
                { userId: req.session.userId },
                { deliverUserId: req.session.userId }
            ]
        }).exec(function (err, order) {
            if (err) return res.negotiate(err);

            if (order) {
                // User has made an order  
                if (order.userId == req.session.userId) {
                    sails.log.debug(`user is ordering order {UserId:${req.session.userId}, OrderId:${order.id}}`);
                } else {
                    sails.log.debug(`user is delivering order {UserId:${req.session.userId}, OrderId:${order.id}}`);
                }
                return res.json(order);
            } else {
                // User has no order
                // Only retrive orders that aren't currently being delivered
                Order.find({ deliverUserId: null }).exec(function (err, otherOrder) {
                    if (err) return res.negotiate(err);
                    sails.log.debug(`user has no order or delivery return all open orders {UserId:${req.session.userId}}`);
                    return res.json(otherOrder);
                });
            }

        });
    },      

    createOrder: function (options, done) {

        const req = options.req;
        const res = options.res;

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

    deleteOrder: function (options, done) {
        const req = options.res;
        const res = options.res;

        sails.log.debug(`delete order associated with {UserId:${req.session.userId}}`);

        // No need to check for ID, you will only have at most ONE order 
        // associated with yourself in the orders table, delete this.

        //Search database for existing order associated with this user
        Order.findOne({
            or: [
                { userId: req.session.userId },
                { deliverUserId: req.session.userIdUserId }
            ]
        }).exec(function (err, order) {
            if (err) return res.negotiate(err);

            // There is an order associated with this user
            if (order) {
                sails.log.debug(`user has an order to delete {OrderId:${order.id}, UserId:${req.session.userId}}`);

                if (order.userId == req.session.userId) {
                    // Clear any orders they have started
                    Order.destroy({ userId: req.session.userId }).exec(function (err, order) {
                        if (err) return res.negotiate(err);
                        if (order) {
                            sails.log.debug(`delete own order successful {OrderId:${order.id}, UserId:${req.session.userId}}`);
                            return res.json(order);
                        }
                    });
                } else {
                    // Clear any orders they were delivering but were never completed
                    Order.update({ deliverUserId: req.session.userId }, { deliverUserId: null }).exec(function (err, order) {
                        if (err) return res.negotiate(err);
                        if (order) {
                            sails.log.debug(`delete delivery user successful {OrderId:${order.id}, UserId:${req.session.userId}}`);
                            return res.json(order);
                        }
                    });
                }
            } else {
                //No orders in here are associated with this user
                sails.log.debug(`user has no order or delivery to delete {UserId:${req.session.userId}}`);
                return res.notModified();
            }



        });

    }
}