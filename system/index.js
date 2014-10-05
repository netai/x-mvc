var express = require('express');
var redisStore=require('connect-redis')(express);
var orm     = require('orm');
var http    = require('http');

var helper     = require('./core/helper');
var model      = require('./core/model');
var controller = require('./core/controller');
var utility     = require('./libraries/utility');
var library     = require('./core/library');

module.exports = function(opt, callback) {
	
    if(arguments.length === 1) {
        callback = opt;
        opt = {};
    }

    var app, setting, mode, path, server;

    express = opt.express   || express;
    orm     = opt.orm       || orm;
    path    = opt.path      || helper.remoteDirname();
    mode    = opt.mode      || process.env.NODE_ENV || 'development';

    app = express();
	app.use(express.cookieParser());
	app.use(express.cookieSession({
		store:new redisStore({
				host:'0.0.0.0',
				port:5345,
				prefix:'sess',
			}),
		secret:'34lljjdhterrr339gtyjdswevbmk4777hhhfm4mrmm5mmm5m3m'
	}));
    app.use(express.session());
	app.use(express.bodyParser({keepExtentions:true}));
	app.use(function(req, res, next) {
                req.utility = utility;
                req.library = library;
                return next();
            });

    var settings     = require(path + '/config/settings');
    var hook_routes  = require(path + '/config/routes');
    var hook_express = require(path + '/config/express');
    var hook_orm     = require(path + '/config/dbConfig');

    if(!settings[mode]) {
        return callback("Invalid Setting");
    }

    setting = settings[mode];
	app.set('views', path + '/views');
	app.use(express.static(path + '/public'));
    app.use(function(req, res, next) {
        req.settings = setting;
        req.mode     = mode;
        return next();
    });

    model(app, {
        setting: setting,
        hook: hook_orm,
        path: path + '/models',
        orm: orm,
        mode: mode
    }, function(err, database) {
        if(err) {
            console.log('Fail to load models');
            return callback(err);
        }

        hook_express(app, express, {
            mode: mode,
            settings: setting
        });

        controller(path + '/controllers', function(err, controllers) {
            if(err) {
                console.log('Fail to load controllers');
                return callback(err);
            }
            
            hook_routes(app, controllers, {
                mode: mode,
                settings: setting
            });
        });

        server = http.createServer(app).listen(setting.port, function(){
            callback(null, {
                server:     server,
                orm:        orm,
                database:   database,
                express:    express,
                app:        app,
                settings:   setting,
                mode:       mode
            });
        });
    });
};
