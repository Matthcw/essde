module.exports = {

    findOrders: function (options) {
        const req = options.req;
        const res = options.res;

        User.findOne({
            id: req.session.userId
        }).exec(function (err, foundUser) {
            if (err) return res.negotiate;
            if (!foundUser) return res.notFound();

            // When ordering or delivering the only order they can find is their own
            // If they have an order, go to that, if they don't, go to any order
            Order.findOne({
                where: {
                    completed: false,
                    deleted: false,
                    or: [
                        { owner: foundUser.id },
                        { deliveringUser: foundUser.id }
                    ]
                }
            }).exec(function (err, order) {
                if (err) return res.negotiate(err);

                if (order) {
                    // User has made an order  
                    if (order.owner == req.session.userId) {
                        sails.log.debug(`user is ordering order {UserId:${req.session.userId}, OrderId:${order.id}}`);
                    } else {
                        sails.log.debug(`user is delivering order {UserId:${req.session.userId}, OrderId:${order.id}}`);
                    }
                    return res.json(order);
                } else {
                    // User has no order
                    // Only retrive orders that aren't currently being delivered
                    Order.find({
                        deliverUser: null,
                        completed: false,
                        deleted: false
                    }).exec(function (err, openOrders) {
                        if (err) return res.negotiate(err);
                        sails.log.debug(`user has no order or delivery return all open orders {UserId:${req.session.userId}}`);
                        return res.json(openOrders);
                    });
                }

            });

        });
    },

    createOrder: function (options) {

        const req = options.req;
        const res = options.res;

        if (_.isUndefined(req.param('price'))) {
            return res.badRequest('A price is required!');
        }
        if (_.isNaN(req.param('price'))) {
            return res.badRequest('Price must be a number!');
        }
        if (_.isUndefined(req.param('items'))) {
            return res.badRequest('Items are required!');
        }
        if (_.isUndefined(req.param('location_lat')) || _.isUndefined(req.param('location_lng'))) {
            return res.badRequest('A location is required!');
        }
        if (_.isNaN(req.param('location_lat')) || _.isNaN(req.param('location_lng'))) {
            return res.badRequest('Location must be valid!');
        }


        User.findOne({
            id: req.session.userId
        }).exec(function (err, foundUser) {
            if (err) return res.negotiate;
            if (!foundUser) return res.notFound();

            Order.create({
                price: req.param('price'),
                items: req.param('items'),
                location_lat: req.param('location_lat'),
                location_lng: req.param('location_lng'),
                owner: foundUser.id
            }).exec(function (err, createdOrder) {
                if (err) return res.negotiate(err);
                sails.log.debug(`create new order {OrderId:${createdOrder.id}, UserId:${req.session.userId}}`);
                sails.sockets.broadcast('vieworders', 'neworder', createdOrder);

                foundUser.orders.add(createdOrder.id);

                foundUser.save(function (err) {
                    if (err) return res.negotiate(err);

                    return res.json(createdOrder);
                });
            });
        })


    },

    completeOrder: function (options) {
        const req = options.req;
        const res = options.res;

        sails.log.debug(`complete order associated with {UserId:${req.session.userId}}`);

        // No need to check for ID, you will only have at most ONE order 
        // associated with yourself in the orders table, delete this.

        //Search database for existing order associated with this user
        Order.findOne({
            userId: req.session.userId,
            completed: false,
            deleted: false
        }).exec(function (err, order) {
            if (err) return res.negotiate(err);

            // There is an order associated with this user
            if (order) {
                sails.log.debug(`user has an order to complete {OrderId:${order.id}, UserId:${req.session.userId}}`);

                // Can only complete order if they are they are the one ordering
                if (order.userId == req.session.userId) {
                    // Clear any orders they have started
                    Order.update({ userId: req.session.userId }, { completed: true }).exec(function (err, completedOrder) {
                        if (err) return res.negotiate(err);
                        if (completedOrder) {

                            // Notify delivering user that order has been completed
                            sails.sockets.broadcast('order' + order.id, 'ordercomplete');
                            sails.sockets.broadcast('vieworders', 'ordercompleted', order.id);

                            sails.log.debug(`complete own order successful {OrderId:${order.id}, UserId:${req.session.userId}}`);
                            return res.json(completedOrder);
                        }
                    });
                }
            } else {
                //No orders in here are associated with this user
                sails.log.debug(`user has no order or delivery to complete {UserId:${req.session.userId}}`);
                return res.notModified();
            }



        });

    },

    deleteOrder: function (options) {
        const req = options.req;
        const res = options.res;

        sails.log.debug(`delete order associated with {UserId:${req.session.userId}}`);

        // No need to check for ID, you will only have at most ONE order 
        // associated with yourself in the orders table, delete this.

        User.findOne({
            id: req.session.userId
        }).exec(function (err, foundUser) {
            if (err) return res.negotiate;
            if (!foundUser) return res.notFound();

            //Search database for existing order associated with this user
            Order.findOne({
                completed: false,
                deleted: false,
                or: [
                    { owner: foundUser.id },
                    { deliveringUser: foundUser.id }
                ]
            }).exec(function (err, order) {
                if (err) return res.negotiate(err);

                // There is an order associated with this user
                if (order) {
                    sails.log.debug(`user has an order to delete {OrderId:${order.id}, UserId:${req.session.userId}}`);

                    if (order.owner == req.session.userId) {
                        // Clear any orders they have started
                        Order.update({ owner: foundUser.id }, { deleted: true }).exec(function (err, deletedOrder) {
                            if (err) return res.negotiate(err);
                            if (deletedOrder) {

                                // Notify delivering user that order has been cancelled
                                sails.sockets.broadcast('order' + order.id, 'ordererleft');
                                sails.sockets.broadcast('vieworders', 'orderdeleted', order.id);


                                sails.log.debug(`delete own order successful {OrderId:${order.id}, UserId:${req.session.userId}}`);
                                return res.json(deletedOrder);
                            }
                        });
                    } else {
                        // Clear any orders they were delivering but were never completed
                        Order.update({ deliveringUser: foundUser.id }, { deliveringUser: null }).exec(function (err, deletedOrder) {
                            if (err) return res.negotiate(err);
                            if (deletedOrder) {

                                // Notify ordering user that delivering user has left
                                sails.sockets.broadcast('order' + deletedOrder.id, 'delivererleft');
                                sails.sockets.broadcast('vieworders', 'delivererunassigned', deletedOrder);

                                sails.log.debug(`delete delivery user successful {OrderId:${deletedOrder.id}, UserId:${req.session.userId}}`);
                                return res.json(deletedOrder);
                            }
                        });
                    }
                } else {
                    //No orders in here are associated with this user
                    sails.log.debug(`user has no order or delivery to delete {UserId:${req.session.userId}}`);
                    return res.notModified();
                }



            });
        });

    }
}