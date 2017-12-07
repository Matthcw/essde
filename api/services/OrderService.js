module.exports = {
    deleteOrder: function (options, done) {
        const thisUserId = options.req.session.userId;
        const res = options.res;

        sails.log.debug(`delete order associated with {UserId:${thisUserId}}`);

        // No need to check for ID, you will only have at most ONE order 
        // associated with yourself in the orders table, delete this.

        //Search database for existing order associated with this user
        Order.findOne({
            or: [
                { userId: thisUserId },
                { deliverUserId: thisUserId }
            ]
        }).exec(function (err, order) {
            if (err) return res.negotiate(err);

            // There is an order associated with this user
            if (order) {
                sails.log.debug(`user has an order to delete {OrderId:${order.id}, UserId:${thisUserId}}`);

                if (order.userId == thisUserId) {
                    // Clear any orders they have started
                    Order.destroy({ userId: thisUserId }).exec(function (err, order) {
                        if (err) return res.negotiate(err);
                        if (order) {
                            sails.log.debug(`delete own order successful {OrderId:${order.id}, UserId:${thisUserId}}`);
                            return res.json(order);
                        }
                    });
                } else {
                    // Clear any orders they were delivering but were never completed
                    Order.update({ deliverUserId: thisUserId }, { deliverUserId: null }).exec(function (err, order) {
                        if (err) return res.negotiate(err);
                        if (order) {
                            sails.log.debug(`delete delivery user successful {OrderId:${order.id}, UserId:${thisUserId}}`);
                            return res.json(order);
                        }
                    });
                }
            } else {
                //No orders in here are associated with this user
                sails.log.debug(`user has no order or delivery to delete {UserId:${thisUserId}}`);
                return res.notModified();
            }



        });

    }
}