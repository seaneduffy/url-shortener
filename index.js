'use strict';

let express = require('express'),
	app = express(),
	http = require('http').Server(app);

app.use(require('cors')());
app.use(require('body-parser').json());
require('./urlshortener')(app);

http.listen(3000, function(){
	console.log('listening on *:3000');
});