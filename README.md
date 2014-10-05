x-mvc
===============
This is simple and light node.js mvc structure just install and create 
controller,model,view and your project is ready
in this mvc we have added more feture like:

* create slug
* flush message
* more comfortable structure
* form validation

this mvc have some separet part like

* Database(default mysql)
* App structure
* Router
* Separate modules
* ...

So hope this library help someone like me.

Any ideas are appreciated.

##Features

* MVC
* This library just help you to structure your code
* No Express or ORM hack
* Config Express and ORM by yourself (Fully control)

##Dependencies

By default:

* [Express](https://github.com/visionmedia/express) ^4.0.0
* [ORM](https://github.com/dresende/node-orm2) ^2.1.5

You can specify those dependencies version by option, please refer to [this](#options)

##Installation

	npm install x-mvc --save

Database package

	for mysql no need to proccess bellow step (default database mysql)

	npm install <your database package>

    //example
    npm install mysql

Refer to ORM document [Connecting to Database](https://github.com/dresende/node-orm2/wiki/Connecting-to-Database)

##App structure

	/
		models/						-- all of your models here
		controllers/				-- all of your controllers here
		views/
		config/
			express.js				-- your express config
			orm.js					-- your orm config
			routes.js				-- router
			settings.js				-- app settings (ip, port, database, ...)
		app.js						-- root

Please check example

##How to use

Please check example or follow these document

###Init

```js
require(x-mvc)(function(err){
	if(err) {
		console.log(err);
		return;
	}
	console.log('done');
});
```

###Models

A model file should be like this

```js
module.exports = function (orm, db) {
    //define your orm model here
};
```

Example:

	models/post.js

```js
module.exports = function (orm, db) {
	var Post = db.define('post', {
		title:      { type: 'text' },
		content:    { type: 'text' }
    });
};
```

Check ORM document [Defining Models](https://github.com/dresende/node-orm2/wiki/Defining-Models)


###Controllers

A controller file should be like this

```js
module.exports = {
    //define your controller here
};
```

Example:

	controllers/post.js

```js
module.exports = {
	home: function(req, res, next){
		res.send('home page');
	},
    get: function(req, res, next) {
        req.models.post.find(function(err, data) {
            res.send(data);
        });
    },
    create: function(req, res, next) {
        req.models.post.create({
            title: 'title',
            content: 'content'
        }, function(err, result) {
            res.send(result);
        });
    }
};
```
**Note:** you can list all of your models in req.models, check more [here](#notes)

###Settings

	config/settings.js

A settings file should be like this

```js
module.exports = {
    mode1: { //development
        ip: <ip>,
        port: <port>,
        db: // orm database setting object
    },
    mode2: { //production
        ip: <ip>,
        port: <port>,
        db: // orm database setting object
    }
};
```

Example:

```js
module.exports = {
    development: {
        ip: '127.0.0.1',
        port: 8080,
        db: {
            host: '127.0.0.1',
            port: 3306,
            protocol: 'mysql',
            user: 'root',
            password: '123456789',
            database: 'test',
            connectionLimit: 100
        }
    },
    production: {
        ip: '127.0.0.1',
        port: 8080,
        db: {
            host: '127.0.0.1',
            port: 3306,
            protocol: 'mysql',
            user: 'root',
            password: '123456789',
            database: 'test',
            connectionLimit: 100
        }
    }
};
```

**Note**: You should set your NODE_ENV variable (development or production), or you can by pass by send directly the mode option when init, check [here](#options)

Check ORM document [Connecting to Database](https://github.com/dresende/node-orm2/wiki/Connecting-to-Database)

###Express config

	config/express.js

A express config file should be like this

```js
module.exports = function(app, express) {
    //any express config here
};
```

Example:

```js
module.exports = function(app, express) {
	app.set('view engine', 'ejs');
};
```

Check Express document [api](http://expressjs.com/api.html)

**Note**:

* As you see there is no ```views``` folder in app structure, so create and manage by yourself
* Library will start a server automatically, so no need this kind of this stuff

```js
http.createServer(app).listen(function(){});
```

###ORM config

	config/dbConfig.js

A orm config file should be like this

```js
module.exports = function(orm, db) {
    //any orm config here
};
```

Example:

```js
module.exports = function(orm, db) {
    db.settings.set('test', 'testing data');
};
```

Check ORM document [Settings](https://github.com/dresende/node-orm2/wiki/Settings)

**Note**: Library will [sync database](https://github.com/dresende/node-orm2/wiki/Synching-and-Dropping-Models#wiki-synching) automatically.

###Routes config

	config/routes.js

A routes config file should be like this

```js
module.exports = function(app, controllers) {
	//routes here
};
```

Example:

```js
module.exports = function(app, controllers) {
    app.get(    '/'       , controllers.post.home);
    app.get(    '/post'   , controllers.post.get);
    app.post(   '/post'   , controllers.post.create);
};
```

##Options

```js
require(x-mvc)({
	mode: 'development',           //default: production
	path: __dirname,               //default: auto detect
    express: require('express'),   //specify your express version
    orm: require('orm')            //specify your orm version
}, callback);
```

Example:

```js

require(x-mvc)({
    mode: 'development',
    path: '/Code/Project',
}, callback);
```

##Return object

``express``

``orm``

``server`` web server instance

``database`` orm database instance

``app`` express app instance

``settings`` the current settings

``mode`` the current mode

```js
require(just-mvc)(functiom(err, mvc) {
    mvc.express;
    mvc.orm;
    mvc.server;
    mvc.database;
    mvc.app;
    mvc.settings;
    mvc.mode;
});
```

##Notes

For your convenience, you can get

* ``models``: all the orm models
* ``settings``: the running setings
* ``mode``: the running mode

###from express req

```js
function (req, res, next) {
    req.models;
    req.settings;
    req.mode;
}
```

###from express config file

```js
//config/express.js
module.exports = function(app, express, mvc) {
    mvc.mode
    mvc.settings
};
```

###from orm config file
```js
//config/orm.js
module.exports = function(orm, db, mvc) {
    mvc.mode
    mvc.settings
};
```
###New Feature

Flush Message

	for flush message follow bellow step
	when you redirect or show view then first save this two data in session
	
	req.session.msg="message";
	req.session.css_class="css-class";
	
	next send bellow variable to view and show
	
	msg=req.utility.flushMsg(req)

Slug

	create a slug follow bellow step
	slug=req.utility.slug(product_name)

form validation

        var form_validation = new req.library.form_validation(<input json data>);//initialize
	form_validation.addRule('<field_name>', '<field label>', 'rule');//add all rule
        form_validation.run(function(err, input){<code here>});//validate
        err: get validation error message
        input: get validation input data
        
        Vlidation rule::
        required: validates that a value exists

		minLength[l]: validates that a value length is at minimum equal to l

		maxLength[l]: validates that a value length is at maximum equal to l

		exactLength[l]: validates that a value length is exactly l

		greaterThan[l]: validate that a value is greater than l

		lessThan[l]: validates that a value is less than l

		alpha: validates that a value contains only alphabet letters [A-Za-z]

		alphaNumeric: validates that a value contains only alphabet letters or numbers [A-Za-z0-9]

		alphaNumericDash: validates that a value contains only alphabet letters, numbers or dash [A-Za-z0-9-]

		numeric: validates that a value is numeric [0-9]

		integer: validates that a value is an integer

		decimal: validates that a value is a decimal number

		natural: validates that a value is a natural number >= 0

		naturalNoZero: validates that a value is a natural number and greater than zero

		email: validates that a value looks like an email

		regex[s]: validates that a value matches the given regular expressions s

		matches[f]: validates that a value matches a value of another field f

		sanitize: sanitize a value against any possible xss attack
