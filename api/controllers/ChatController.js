/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    sendMessage: function (req, res) {


        Order.findOne({
            or: [
                { userId: req.session.id },
                { deliverUserId: req.session.id }]
        }).populate('chats').exec(function (err, order) {
            if (err) return res.negotiate(err);
            
            order.chats.add({
                message: req.param('message'), 
                senderId: req.session.userId
            });

            order.save(function (err) {
                res.json(updatedOrder);
            });

        });
    }
};

