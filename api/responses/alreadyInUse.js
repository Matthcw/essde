module.exports = function alreadyInUse (err) {
    var res = this.res;

    if(err.invalidAttributes.email) {
        return res.send(409, 'Email address is already taken, please try again.');
    }

    return res.send(500);
}