/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    joinOrderItemsRoom: function (req, res) {
        if (!req.isSocket) {
            sails.log.debug(`not a socket connection joinOrderItemsRoom()`);

            return res.badRequest();
        }

        sails.log.debug(`User attempting to join an orderitem room
        {UserId:${req.session.userId}}`);

        User.findOne({
            id: req.session.userId
        }).exec(function (err, foundUser) {
            if (err) return res.negotiate;
            if (!foundUser) return res.notFound();
            // Only join chat rooms with a users order
            Order.findOne({
                completed: false,
                deleted: false,
                or: [
                    { owner: foundUser.id },
                    { deliveringUser: foundUser.id }]
            }).exec(function (err, order) {
                if (err) return res.negotiate(err);

                if (!order) {
                    sails.log.debug(`User has no orderitem room to join {UserId:${req.session.userId}}`);
                    return res.notFound();
                }

                sails.sockets.join(req, 'order' + order.id);

                sails.log.debug(`User joined orderitem room            
            {UserId:${req.session.userId}, OrderId:${order.id}}`);

                return res.json({ room: 'order' + order.id });
            });
        });

    },

    joinViewOrdersRoom: function (req, res) {
        if (!req.isSocket) {
            sails.log.debug(`not a socket connection joinViewOrdersRoom()`);

            return res.badRequest();
        }

        sails.sockets.join(req, 'vieworders');

        sails.log.debug(`User joined the orders room            
        {UserId:${req.session.userId}, OrderId:${req.param('id')}}`);

        return res.json({ room: 'vieworders' });
    },

    chat: function (req, res) {
        if (!req.isSocket) {
            sails.log.debug(`not a socket connection chat()`);

            return res.badRequest();
        }

        sails.log.debug(`User attempting to send a chat message
        {UserId:${req.session.userId}}`);

        User.findOne({
            id: req.session.userId
        }).exec(function (err, foundUser) {
            if (err) return res.negotiate;
            if (!foundUser) return res.notFound();
            // Only send chat messages to rooms with a users order
            Order.findOne({
                completed: false,
                deleted: false,
                or: [
                    { owner: foundUser.id },
                    { deliveringUser: foundUser.id }]
            }).exec(function (err, order) {
                if (err) return res.negotiate(err);

                if (!order) {
                    sails.log.debug(`User has no order to message in {UserId:${req.session.userId}}`);
                    return res.notFound();
                }

                sails.sockets.broadcast('order' + order.id, 'chat', {
                    message: req.param('message'),
                    userId: req.session.userId
                });

                sails.log.debug(`User sent chat message in order            
            {UserId:${req.session.userId}, OrderId:${req.param('id')}}`);

                return res.json({ chat: 'messaged' });
            });
        });

    },

    deliveryUserLocation: function (req, res) {
        if (!req.isSocket) {
            sails.log.debug(`not a socket connection deliveryUserLocation()`);

            return res.badRequest();
        }

        sails.log.debug(`User attempting to send a location message
        {UserId:${req.session.userId}}`);

        User.findOne({
            id: req.session.userId
        }).exec(function (err, foundUser) {
            if (err) return res.negotiate;
            if (!foundUser) return res.notFound();
            // Only location messages to rooms with a users order
            Order.findOne({
                completed: false,
                deleted: false,
                or: [
                    { owner: foundUser.id },
                    { deliveringUser: foundUser.id }]
            }).exec(function (err, order) {
                if (err) return res.negotiate(err);

                if (!order) {
                    sails.log.debug(`User has no order to message in {UserId:${req.session.userId}}`);
                    return res.notFound();
                }

                sails.sockets.broadcast('order' + order.id, 'location', {
                    lat: req.param('lat'),
                    lng: req.param('lng'),
                });

                sails.log.debug(`User sent location message in order            
            {UserId:${req.session.userId}, OrderId:${req.param('id')}}`);

                return res.json({ location: 'sent' });
            });
        });
    },

    findOrders: function (req, res) {
        sails.log.debug(`OrderController.findOrders() {UserId:${req.session.userId}}`);

        OrderService.findOrders({ req: req, res: res });

    },

    createOrder: function (req, res) {
        sails.log.debug(`OrderController.createOrder() {UserId:${req.session.userId}}`);

        /* isNotOrdering Policy */
        /* isNotDelivering Policy */

        OrderService.createOrder({ req: req, res: res });

    },

    completeOrder: function (req, res) {
        sails.log.debug(`OrderController.completeOrder() {UserId:${req.session.userId}}`);

        OrderService.completeOrder({ req: req, res: res });
    },

    deleteOrder: function (req, res) {
        sails.log.debug(`OrderController.deleteOrder() {UserId:${req.session.userId}}`);

        OrderService.deleteOrder({ req: req, res: res });
    }
};
