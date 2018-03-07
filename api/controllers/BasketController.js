/**
 * BasketController
 *
 * @description :: Server-side logic for managing baskets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	findItems: function (req, res) {
        Basket.find({userId: req.session.userId}).exec(function(err, basketItems) {
            if(err) return res.negotiate(err);
            sails.log.debug(`user got all items from basket {UserId:${req.session.userId}}`);                                   
            return res.json(basketItems)
        })
    },

    createItem: function (req, res) {
        sails.log.debug('typeof req.session.userId ' + typeof Basket.mongo.objectId(req.session.userId));
        Basket.create({
            price: req.param('price'),
            items: req.param('items'),
            userId: Basket.mongo.objectId(req.session.userId)
        }).exec(function(err, basketItem) {  
            console.log(err);        
            if(err) return res.negotiate(err);
            sails.log.debug(`user added item to basket {BasketItem:${basketItem.items}, UserId:${req.session.userId}}`);                       
            return res.json(basketItem)
        })        
    },

    destroyItem: function (req, res) {
        Basket.destroy({
            id: Basket.mongo.objectId(req.param('id')),
            userId: req.session.userId
        }).exec(function(err, basketItem) {
            if(err) return res.negotiate(err);
            sails.log.debug(`user removed item from basket {BasketItem:${basketItem.items}, UserId:${req.session.userId}}`);            
            return res.json(basketItem)
        })
    },

    destroyItems: function (req, res) {
        Basket.destroy({
            userId: req.session.userId
        }).exec(function(err, basketItems) {
            if(err) return res.negotiate(err);
            sails.log.debug(`user removed all items from basket {UserId:${req.session.userId}}`);                        
            return res.json(basketItems)
        })
    }
};

