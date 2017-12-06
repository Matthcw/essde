/**
 * BasketController
 *
 * @description :: Server-side logic for managing baskets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function (req, res) {
        Basket.find({userId: req.session.userId}).exec(function(err, basketItems) {
            if(err) return res.negotiate(err);

            return res.json(basketItems)
        })
    },

    create: function (req, res) {
        Basket.create({
            price: req.param('price'),
            items: req.param('items'),
            userId: req.session.userId
        }).exec(function(err, basketItems) {
            if(err) return res.negotiate(err);

            return res.json(basketItems)
        })
    },

    destroy: function (req, res) {
        Basket.destroy({
            id: req.param('id'),
            userId: req.session.userId
        }).exec(function(err, basketItems) {
            if(err) return res.negotiate(err);

            return res.json(basketItems)
        })
    }
};

