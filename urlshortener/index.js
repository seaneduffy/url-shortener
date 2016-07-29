'use strict';

let API = require('./api');

module.exports = function(app) {	
	new API(app);
}