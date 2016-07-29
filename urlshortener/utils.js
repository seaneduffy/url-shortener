'use strict';

let characterPool = new String('abcdefghijklmnopqrstuvwxyz').concat(new String('abcdefghijklmnopqrstuvwxyz').toUpperCase()).concat('0123456789').split('');

module.exports = {
	validateURL: function(url) {
		return true;
	},
	toBase62: function(n) {
	
		let result = '';
	
		while(n > 0) {
			var remainder = n % 62;
			result = result.concat(characterPool[remainder]);
			n = Math.floor(n / 62);
		}
	
		return result;
	},
	fromBase62: function(str) {
	
		let number = 0;
	
		str.split('').forEach(function(character, index) {
			number += characterPool.indexOf(character) * Math.pow(62, index);
		});
	
		return number;
	}
}