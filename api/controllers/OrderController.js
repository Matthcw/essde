/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    findOrders: function (req, res) {
        sails.log.debug(`OrderController.findOrders() {UserId:${req.session.userId}}`);
        
        OrderService.findOrders({ req: req, res: res });
        
    },

    createOrder: function (req, res) {
        sails.log.debug(`OrderController.createOrder() {UserId:${req.session.userId}} `);

        /* isNotOrdering Policy */
        /* isNotDelivering Policy */

        OrderService.createOrder({ req: req, res: res });

    },

    destroyOrder: function (req, res) {
        sails.log.debug(`OrderController.destroyOrder() {UserId:${req.session.userId}} `);

        OrderService.deleteOrder({ req: req, res: res });
    }
};
