// server.js

var bodyParser  = require('body-parser');
var cookieParser= require('cookie-parser');
var cool        = require("cool-ascii-faces");
var flash       = require('connect-flash');
var fs          = require('fs');
var express     = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var exphbs      = require('express-handlebars');
var http        = require('http');
var iconvlite   = require('iconv-lite');
var mongoose    = require('mongoose');
var morgan      = require('morgan');
var nodemailer  = require("nodemailer");
var passport    = require('passport');
var querystring = require('querystring');
var request     = require('request');
var session     = require('cookie-session');
var url         = require("url" );
var xoauth2     = require("xoauth2");

var configDB    = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration
require('./config/survey')(survey); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));// get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
