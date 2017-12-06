/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    find: function (req, res) {
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
                    Order.find().exec(function (err, otherOrder) {
                        if (err) return res.negotiate(err);
                        return res.json(otherOrder);
                    });
                }

            }

        });
    },

    create: function (req, res) {
        Order.create({
            price: req.param('price'),
            items: req.param('items'),
            location_lat: req.param('location_lat'),
            location_lng: req.param('location_lng'),
            userId: req.session.userId
        }).exec(function (err, orderItems) {
            if (err) return res.negotiate(err);
            return res.json(orderItems);
        });


    },

    destroy: function (req, res) {
        Order.destroy({
            id: req.param('id'),
            userId: req.session.userId
        }).exec(function (err, orderItems) {
            if (err) return res.negotiate(err);
            return res.json(orderItems);
        })
    }
};
