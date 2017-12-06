module.exports = function isOrdering(req, res, next) {
    if(!req.session.userId) {
        if(req.wantsJSON) {
            return res.forbidden('You are not permitted to perform this action.');
        }
        return res.redirect('/');
    }   
    
    User.findOne({ id: req.session.userId }).exec(function (err, user) {
        if (err) return res.negotiate(err);

        if (!user) {
            req.session.userId = null;
            if(req.wantsJSON) {
                return res.forbidden('You are not permitted to perform this action.');
            }
            return res.redirect('/');
        }        

        if (!user.admin) {
            if(req.wantsJSON) {
                return res.forbidden('You are not permitted to perform this action.');
            }
            return res.redirect('/dashboard');
        }

        return next();
    });
}
