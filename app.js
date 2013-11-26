var express = require('express'),
    http = require('http'),
    passport = require('passport'),
    path = require('path'),
    User = require('./server/models/User.js');

var app = module.exports = express();

app.set('views', __dirname + '/client/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'))
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.cookieSession(
    {
      secret: process.env.COOKIE_SECRET || "2234567890QWERTY"
    }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.localStrategy);

passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

require('./server/routes.js')(app);

if (app.get('env') === 'development') {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}
;

if (app.get('env') === 'production') {
  app.use(express.errorHandler());
}
;

app.set('port', process.env.PORT || 4730);
http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
