var path     = require('path');
var callsite = require('./callsite');
var fs       = require('fs');

exports.listJSFiles = function(dir, callback) {
    fs.readdir(dir, function (err, files) {
        if (err) return callback(err);
        var js_files = [];
        for(var i = 0; i < files.length; i++) {
            var file = files[i];
            var file_path = path.join(dir, file);
            if(!fs.statSync(file_path).isFile())
                continue;
            if(path.extname(file_path) === '.js')
                js_files.push(file_path);
        }
        callback(null, js_files);
    });
};

/*
    Get the caller path dir then append file name
    @param {String} file_name
    @return {String} caller path join file name
*/
exports.remoteDirname = function(file_name) {
    file_name = file_name || '';
    var stack = callsite();
    /*
        0 -> helper (this file)
        1 -> express-orm-mvc
        2 -> root file
    */
    var requester = stack[2].getFileName();

    return path.join(path.dirname(requester), file_name);
};
