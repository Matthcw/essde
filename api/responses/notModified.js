module.exports = function notModified () {
    var res = this.res;
    
    return res.send(304, 'Nothing was modified. No need to send that request.');
    
}