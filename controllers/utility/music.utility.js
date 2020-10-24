var exports = (module.exports = {});

exports.num_normalizer = function(n){
    n = ~~n
    if(n < 48 || n > 83) n = n%35 + 48
    return n;
};