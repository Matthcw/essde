module.exports = function isNotDelivering(req, res, next) {

    User.findOne({
        id: req.session.userId
    }).exec(function (err, foundUser) {
        if (err) return res.negotiate;
        if (!foundUser) return res.notFound();

        Order.findOne({
            deliveringUser: foundUser.id,
            completed: false,
            deleted: false
        }).exec(function (err, order) {
            if (err) return res.negotiate(err);

            if (!order) {
                // User has no active delivery
                sails.log.debug(`not delivering {UserId:${req.session.userId}}`);
                return next();

            } else {
                // User has an active delivery
                if (req.wantsJSON) {
                    sails.log.debug('Returning 403 from from isNotDelivering()');
                    return res.forbidden('You are not permitted to perform this action.');
                }
                //Redirect to order
                sails.log.debug(`Redirecting {UserId:${req.session.userId}} to /order/${order.id} from isNotDelivering()`);
                return res.redirect('/order/' + order.id);
            }
        });
    });
}
