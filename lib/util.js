exports.exit = function(err) {
    if (err) {
        console.error(err);
        return process.exit(1);
    }
    
    process.exit(0);
};

exports.resolve = function(err, callback) {
    if (err) {
        return console.error(err);
    }

    callback();
};