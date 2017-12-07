module.exports = function isLoggedOut(req, res, next) {
    sails.log.debug(`UserId=${req.session.userId} is in isLoggedOut()`);
    
    if(!req.session.userId) {
        sails.log.debug('Calling next() from isLoggedOut()');                      
        return next();
    }

    if(req.wantsJSON) {
        sails.log.debug('Returning 403 from from isLoggedOut()');                            
        return res.forbidden('You are not permitted to perform this action.');
    }

    sails.log.debug('Redirecting to / from isLoggedOut()');                    
    return res.redirect('/');
}