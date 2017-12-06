module.exports = function isNotOrdering(req, res, next) {
    
    Order.findOne({ userId: req.session.userId }).exec(function (err, order) {
        if (err) return res.negotiate(err);
        
        if (!order) {
            // User has no active order
            return next();
            
        } else {
            // User has an active order
            if(req.wantsJSON) {
                return res.forbidden('You are not permitted to perform this action.');
            }
            //Redirect to order
            return res.redirect('/order/' + order.id);   
        }        
    });
}
