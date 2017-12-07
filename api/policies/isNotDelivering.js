module.exports = function isNotDelivering(req, res, next) {
    sails.log.debug(`UserId=${req.session.userId} is in isNotDelivering()`);
    
    
    Order.findOne({ deliverUserId: req.session.userId }).exec(function (err, order) {
        if (err) return res.negotiate(err);
        
        if (!order) {
            // User has no active delivery
            sails.log.debug('Calling next() from isNotDelivering()');                          
            return next();
            
        } else {
            // User has an active delivery
            if(req.wantsJSON) {
                sails.log.debug('Returning 403 from from isNotDelivering()');                                    
                return res.forbidden('You are not permitted to perform this action.');
            }
            //Redirect to order
            sails.log.debug(`Redirecting to /order/${order.id} from isNotDelivering()`);                            
            return res.redirect('/order/' + order.id);   
        }        
    });
}
