'use strict';

let utils = require('../utils'),
	UrlModel = require('./url');

function UrlSetModel() {}

Object.defineProperties(UrlSetModel.prototype, {
	"url": {
		set: function(id) {
			this._url = id;
		},
		get: function() {
			return this._url || null;
		}
	},
	"desktopUrl": {
		set: function(id) {
			this._desktopUrl = id;
		},
		get: function() {
			return this._desktopUrl || null;
		}
	},
	"tabletUrl": {
		set: function(id) {
			this._tabletUrl = id;
		},
		get: function() {
			return this._tabletUrl || null;
		}
	},
	"mobileUrl": {
		set: function(id) {
			this._mobileUrl = id;
		},
		get: function() {
			return this._mobileUrl || null;
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
	"code": {
		set: function(code) {
			this._code = code;
		},
		get: function() {
			return this._code || null;
		}
	},
	"error": {
		set: function(error) {
			this._error = error;
		},
		get: function() {
			return this._error;
		}
	},
	"save": {
		value: function(db) {
			
			let urlSetModel = this;
			
			return new Promise(function(resolve, reject) {
				
				if(!!urlSetModel.error) {
					resolve({success: false, error:urlSetModel.error});
				}
				
				let query = typeof urlSetModel.id === 'undefined' ? 
					'insert into urlSets (url,desktopUrl,tabletUrl,mobileUrl,code) values (?,?,?,?,?)' :
					'update urlSets set url = ?, desktopUrl = ?, tabletUrl = ?, mobileUrl = ?, code = ? where id='+urlSetModel.id,
					values = [urlSetModel.url, urlSetModel.desktopUrl, urlSetModel.tabletUrl, urlSetModel.mobileUrl, urlSetModel.code];
				
				db.run(query, values).then(function(result) {
					
					if(result.success) {
						if(typeof urlSetModel.id === 'undefined') {
							urlSetModel.id = result.data.lastID;
							urlSetModel.code = utils.toBase62(result.data.lastID);
							resolve(urlSetModel.save(db));
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
			
			let urlSetModel = this;
			
			return new Promise(function(resolve, reject) {
				let query = 'select * from urlSets where id = ?',
					values = urlSetModel.id;
				db.get(query, values).then(function(result) {
					if(typeof result === 'undefined')
						resolve({success: false, error: 'Could not load URL Set: No rows found'});
					urlSetModel.url = result.data.url;
					urlSetModel.desktopUrl = result.data.desktopUrl;
					urlSetModel.tabletUrl = result.data.tabletUrl;
					urlSetModel.mobileUrl = result.data.mobileUrl;
					urlSetModel.shortenedUrl = result.data.shortenedUrl;
					urlSetModel.id = result.data.id;
					urlSetModel.code = result.data.code;
					resolve({success: true});
				}, function(reason) {
					resolve({success: false, error: reason});
				});
			});
		}
	},
	"export": {
		value: function(db) {
			let urlSetModel = this;
			return new Promise(function(resolve, reject) {
				let promises = new Array(),
					urlModels = new Array(),
					urlLabels = new Array(),
					urlModel = new UrlModel();
				
				urlModel.id = urlSetModel.url;
				promises.push(urlModel.load(db));
				urlModels.push(urlModel);
				urlLabels.push('defaultUrl');
				
				if(urlSetModel.desktopUrl !== null) {
					urlModel = new UrlModel();
					urlModel.id = urlSetModel.desktopUrl;
					promises.push(urlModel.load(db));
					urlModels.push(urlModel);
					urlLabels.push('desktopUrl');
				}
				if(urlSetModel.tabletUrl !== null) {
					urlModel = new UrlModel();
					urlModel.id = urlSetModel.tabletUrl;
					promises.push(urlModel.load(db));
					urlModels.push(urlModel);
					urlLabels.push('tabletUrl');
				}
				if(urlSetModel.mobileUrl !== null) {
					urlModel = new UrlModel();
					urlModel.id = urlSetModel.mobileUrl;
					promises.push(urlModel.load(db));
					urlModels.push(urlModel);
					urlLabels.push('mobileUrl');
				}
				Promise.all(promises).then(function(result){
					
					let obj = {};
					urlModels.forEach(function(model, index){
						obj[urlLabels[index]] = {
							url: model.url,
							redirects: model.redirects,
							dateCreated: model.dateCreated,
							id: model.id
						}
					});
					obj.id = urlSetModel.id;
					obj.code = urlSetModel.code;
					resolve({success:true, data:obj});
				}, function(reason){
					resolve({success:false, error: reason});
				})
			});
		}
	}
});

module.exports = UrlSetModel;