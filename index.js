const express = require('express');
const app = express();
const router = require('./router');

app.use('/',router);
app.use(express.static(__dirname + '/public'));

app.listen(3000,function() {
	console.log('Running on 3000');
});