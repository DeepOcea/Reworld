var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo/es5')(session);//node低于4.0版本使用'connect-mongo/es5'
// var session = require('express-session');
// var RedisStore = require('connect-redis')(session);
var flash = require('connect-flash');

var routes = require('./routes/index');
var api = require('./routes/api');
var login = require('./routes/login');
var logout = require('./routes/logout');
var register = require('./routes/register');
var config = require('./config/config');
var mongodb = require('./models/db.js');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

// var options = {
//   "host": "50.30.35.9",
//   "port": "3510",
//   "ttl": 60 * 60 * 24 * 30,   //Session的有效期为30天
// };

// // 此时req对象还没有session这个属性
// app.use(session({
//   store: new RedisStore(options),
//   secret: 'wuan is powerful'
// }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var sessionMiddleware = session({
    secret: config.db.cookieSecret,
    key: config.db.db, //cookie name
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30
    }, //30 days
    store: new MongoStore({
        url: 'mongodb://localhost/wuanDB'
    })
});
// app.use(session({
//   secret: config.db.cookieSecret,
//   key: config.db.db,//cookie name
//   cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
//   store: new MongoStore({
//     url: 'mongodb://localhost/wuanDB'
//   })
// }));
app.use(sessionMiddleware);


app.use('/api/', api);
// 路由入口的拦截，进行登陆的判定
// app.use(function(req, res, next) {
// 	var url = req.originalUrl;
// 	console.log("url", url);
// 	var UnAuthUrl = ["/login", "/", "/api/getIndex"];
// 	if (UnAuthUrl.indexOf(url) == -1 && !req.session.user) {
// 		return res.redirect("/login");
// 	}
// 	next();
// });




app.use('/', routes);
app.use('/login', login);
app.use('/logout', logout);
app.use('/register',register);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;
module.exports.sessionMiddleware = sessionMiddleware;