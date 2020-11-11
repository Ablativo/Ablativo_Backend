var exports = (module.exports = {});


exports.num_normalizer = function(n, model){
    n = ~~n
    if(model === 'basic'){
        console.log('basic')
        if(n < 48 || n > 83) n = n%35 + 48
        return n;
    }
    else{
        if(n < 21 || n > 108) n = n%87 + 21
        return n;
    }
};