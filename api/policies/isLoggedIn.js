module.exports = function isLoggedIn(req, res, next) {
    
    if (req.session.userId) {
        sails.log.debug(`logged in {UserId:${req.session.userId}}`);                                      
        
        return next();
    }
    
    if (req.wantsJSON) {
        sails.log.debug('Returning 403 from from isLoggedIn()');
        return res.forbidden('You are not permitted to perform this action.');
    }

    sails.log.debug('LoggedIn req.session.userId:' + req.session.userId);
    sails.log.debug(`Redirecting user to / from isLoggedIn()`);
    return res.redirect('/');
}