/**
 * BasketController
 *
 * @description :: Server-side logic for managing baskets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	findItems: function (req, res) {
        User.findOne({
            id: req.session.userId
        }).populate('basketItems').exec(function(err, foundUser) {
            if(err) return res.negotiate(err);
            sails.log.debug(`user got all items from basket {UserId:${req.session.userId}}`);                                   
            return res.json(foundUser.basketItems)
        })
    },

    createItem: function (req, res) {
        // Test to see if basket items are associated with correct user id
        User.findOne({
            id: req.session.userId
        }).exec(function(err, foundUser) {
            if (err) return res.negotiate;
            if (!foundUser) return res.notFound();

            Basket.create({
                price: req.param('price'),
                items: req.param('items'),
                owner: foundUser.id
            }).exec(function(err, createdBasketItem) {  
                       
                if(err) return res.negotiate(err);
                sails.log.debug(`user added item to basket {BasketItem:${createdBasketItem.items}, UserId:${req.session.userId}}`);                       
                
                foundUser.basketItems.add(createdBasketItem.id);

                foundUser.save(function (err) {
                    if (err) return res.negotiate(err);

                    return res.json(createdBasketItem);
                });                
            }) 
        })
               
    },

    destroyItem: function (req, res) {

        User.findOne({
            id: req.session.userId
        }).exec(function(err, foundUser) {
            if (err) return res.negotiate;
            if (!foundUser) return res.notFound();

            Basket.destroy({
                id: Basket.mongo.objectId(req.param('id')),
                owner: foundUser.id
            }).exec(function(err, destroyedBasketItem) {
                if(err) return res.negotiate(err);
                destroyedBasketItem = destroyedBasketItem[0];
                sails.log.debug('req.param(id) ' + req.param('id'));
                sails.log.debug('destroyedBasketItem ' + JSON.stringify(destroyedBasketItem));
                sails.log.debug(`user removed item from basket {BasketItem:${destroyedBasketItem.items}, UserId:${req.session.userId}}`);            
                
                foundUser.basketItems.remove(destroyedBasketItem.id);

                foundUser.save(function (err) {
                    if (err) return res.negotiate(err);

                    return res.json(destroyedBasketItem)
                });  
                
            }) 
        })
        
    },

    destroyItems: function (req, res) {

        User.findOne({
            id: req.session.userId
        }).exec(function(err, foundUser) {
            if (err) return res.negotiate;
            if (!foundUser) return res.notFound();

            Basket.destroy({
                owner: foundUser.id
            }).exec(function(err, destroyedBasketItems) {
                if(err) return res.negotiate(err);
                sails.log.debug(`user removed all items from basket {UserId:${req.session.userId}}`);                        
                
                //Loop through each basketItem and remove their ID from user
                _.each(destroyedBasketItems, (destroyedBasketItem) => {
                    foundUser.basketItems.remove(destroyedBasketItem.id);
                })

                foundUser.save(function (err) {
                    if (err) return res.negotiate(err);

                    return res.json(destroyedBasketItems)
                });  
            })
        })

        
    }
};

