module.exports = function isLoggedIn(req, res, next) {
    sails.log.debug(`UserId=${req.session.userId} is in isLoggedIn()`);
    if(req.session.userId) {
        sails.log.debug('Calling next() from isLoggedIn()');    
        return next();
    }

    if(req.wantsJSON) {
        sails.log.debug('Returning 403 from from isLoggedIn()');    
        return res.forbidden('You are not permitted to perform this action.');
    }

    sails.log.debug('Redirecting from isLoggedIn()');    
    return res.redirect('/');
}