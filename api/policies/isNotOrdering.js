module.exports = function isNotOrdering(req, res, next) {
    sails.log.debug(`UserId=${req.session.userId} is in isNotOrdering()`);
    
    Order.findOne({ userId: req.session.userId }).exec(function (err, order) {
        if (err) return res.negotiate(err);
    
        if (!order) {
            // User has no active order
            sails.log.debug('Calling next() from isNotOrdering()');              
            return next();
            
        } else {
            // User has an active order
            if(req.wantsJSON) {
                sails.log.debug('Returning 403 from from isNotOrdering()');                    
                return res.forbidden('You are not permitted to perform this action.');
            }
            //Redirect to order
            sails.log.debug(`Redirecting to /order/${order.id}  from isNotOrdering()`);                
            return res.redirect('/order/' + order.id);   
        }        
    });
}
