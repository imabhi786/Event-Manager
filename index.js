const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = require('./router');
const exphbs = require('express-handlebars');
var session = require('client-sessions');
var hbshelpers = require('./helpers/helpers');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(session({
	cookieName: 'session',
	secret: 'random_string_goes_here',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
  }));

var hbs = exphbs.create({
	defaultLayout : 'main',
	helpers: hbshelpers
});
app.engine('handlebars',hbs.engine);
app.set('view engine', 'handlebars');

app.use(function(req, res, next) {
    if (!req.user) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
    }
    next();
});

app.use('/',router);

app.listen(3000,function() {
	console.log('Running on 3000');
});