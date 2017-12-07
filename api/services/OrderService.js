module.exports = {
    deleteOrder: function (options, done) {
        
        Order.findOne({ id: options.req.param('id') }).exec(function (err, order) {
            if (err) return options.res.negotiate(err);
            if (!order) return options.res.notFound();

            // If this order was made by the user, delete it
            if(order.userId == options.req.session.userId) {
                sails.log.debug(`delete own order {OrderId:${order.id}, UserId:${options.req.session.userId}}`);                                              
                Order.destroy({
                    id: options.req.param('id'),
                    userId: options.req.session.userId
                }).exec(function (err, orderItems) {
                    if (err) return options.res.negotiate(err);
                    sails.log.debug(`delete own order successful {OrderId:${order.id}, UserId:${options.req.session.userId}}`);                                              
                
                    return options.res.json(orderItems);
                });
            } else if(order.deliverUserId == req.session.userId) {
                // If this was made by the delivering user just clear them from delivery 
                
                sails.log.debug(`delete delivery user from order {OrderId:${order.id}, UserId:${options.req.session.userId}}`);                                              
                
                Order.update({
                    deliverUserId: options.req.session.userId
                }, {
                    deliverUserId: null
                }).exec(function(err, updatedOrder) {
                    if (err) return options.res.negotiate(err);
                    sails.log.debug(`delete delivery user successful {OrderId:${order.id}, UserId:${options.req.session.userId}}`);                                              
                    
                    return res.json(updatedOrder);
                });
            } else {
                // This delete request was made by neither the order user or delivery user
                sails.log.debug(`user not allowed to delete order {OrderId:${order.id}, UserId:${options.req.session.userId}}`);                                              
                return options.res.forbidden('You are not permitted to perform this action.');      
            }

                  
        });
    }
}