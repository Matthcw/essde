module.exports = function isNotOrdering(req, res, next) {
    
    Order.findOne({ userId: req.session.userId }).exec(function (err, order) {
        if (err) return res.negotiate(err);
    
        if (!order) {
            // User has no active order
            sails.log.debug(`not ordering {UserId:${req.session.userId}}`);                                      
            return next();
            
        } else {
            // User has an active order
            if(req.wantsJSON) {
                sails.log.debug('Returning 403 from from isNotOrdering()');                    
                return res.forbidden('You are not permitted to perform this action.');
            }
            //Redirect to order
            sails.log.debug(`Redirecting {UserId:${req.session.userId}} to /order/${order.id} from isNotOrdering()`);                            
            return res.redirect('/order/' + order.id);   
        }        
    });
}
