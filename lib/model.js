var path     = require('path');
var helper   = require('./helper');

module.exports = function(app, opt, callback) {
    var orm = opt.orm;
    orm.connect(opt.setting.db, function(err, db) {
        if(err) return callback(err);
        opt.hook(orm, db, {
            mode: opt.mode,
            settings: opt.setting
        });
        helper.listJSFiles(opt.path, function(err, files) {
            if(err) return callback(err);

            for(var i = 0; i < files.length; i++) {
                require(files[i])(orm, db);
            }
            app.use(function(req, res, next) {
                req.db = db;
                req.models = db.models;
                return next();
            });
            db.sync(function(err) {
                if(err) return callback(err);

                callback(null, db);
            });
        });
    });
};
