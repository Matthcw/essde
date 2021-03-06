module.exports = function isAdmin(req, res, next) {
    
    
    if(!req.session.userId) {
        if(req.wantsJSON) {
            sails.log.debug('Returning 403 from from isAdmin()');                                                
            return res.forbidden('You are not permitted to perform this action.');
        }
        return res.redirect('/');
    }   
    
    User.findOne({ id: req.session.userId }).exec(function (err, user) {
        if (err) return res.negotiate(err);

        if (!user) {
            req.session.userId = null;
            if(req.wantsJSON) {
                sails.log.debug('Returning 403 from from isAdmin()');                                                            
                return res.forbidden('You are not permitted to perform this action.');
            }
            sails.log.debug(`Redirecting {UserId:${req.session.userId}} to / from isLoggedIn()`);            
            return res.redirect('/');
        }        

        if (!user.admin) {
            if(req.wantsJSON) {
                sails.log.debug('Returning 403 from from isAdmin()');                                                                            
                return res.forbidden('You are not permitted to perform this action.');
            }
            sails.log.debug(`Redirecting {UserId:${req.session.userId}} to / from isLoggedIn()`);            
            return res.redirect('/dashboard');
        }

        sails.log.debug(`is admin {UserId:${req.session.userId}}`);                                  
        return next();
    });
}
