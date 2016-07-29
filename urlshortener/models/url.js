'use strict';

let utils = require('../utils');

function UrlModel() {}

Object.defineProperties(UrlModel.prototype, {
	"url": {
		set: function(url) {
			if(utils.validateURL(url)) {
				this._url = url;
			} else {
				this.error = "URL is invalid";
			}
		},
		get: function() {
			return this._url || null;
		}
	},
	"redirects": {
		set: function(redirects) {
			this._redirects = redirects;
		},
		get: function() {
			return this._redirects || 0;
		}
	},
	"createdDate": {
		set: function(date) {
			date = typeof date !== 'string' ? date.toString() : date;
			this._createdDate = date;
		},
		get: function() {
			return this._createdDate || null;
		}
	},
	"error": {
		set: function(error) {
			this._error = error;
		},
		get: function() {
			return this._error || null;
		}
	},
	"id": {
		set: function(id) {
			this._id = id;
		},
		get: function() {
			return this._id;
		}
	},
	"save": {
		value: function(db){
			
			let urlModel = this;
			
			return new Promise(function(resolve, reject) {

				if(!!urlModel.error) {
					resolve({success: false, error: urlModel.error});
				}
				
				let query = typeof urlModel.id === 'undefined' ? 
					'insert into urls (url,redirects,createdDate) values(?,?,?)' :
					'update urls set url = ?, redirects = ?, createdDate = ? where id='+urlModel.id,
					values = [urlModel.url, urlModel.redirects, urlModel.createdDate];
				
				db.run(query, values).then(function(result) {

					if(result.success) {
						if(typeof urlModel.id === 'undefined') {
							urlModel.id = result.data.lastID;
							resolve({success: true});
						} else {
							resolve({success: true});
						}
					} else {
						resolve(result);
					}
				});
			});
		}
	},
	"load": {
		value: function(db){

			let urlModel = this;
			
			return new Promise(function(resolve, reject){

				let query = null,
					values = null;
					
				if(!!urlModel.id) {
					query = 'select * from urls where id = ?';
					values = urlModel.id;
				} else if(!!urlModel.url) {
					query = 'select * from urls where url = ?';
					values = urlModel.url;
				} else {
					resolve({success:false, error:'URL or ID not defined'});
				}
				db.get(query, values).then(function(result){
					
					if(result.success) {
						urlModel.url = result.data.url;
						urlModel.redirects = result.data.redirects;
						urlModel.createdDate = result.data.createdDate;
						urlModel.id = result.data.id;
						resolve({success:true});
					} else {
						resolve({success:false});
					}
				}, function(reason) {
					resolve({success:false, error:reason});
				});
			});
		}
	}
});

module.exports = UrlModel;