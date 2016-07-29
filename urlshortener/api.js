'use strict';

let UrlModel = require('./models/url'),
	UrlSetModel = require('./models/urlset'),
	config = require('../config/development'),
	Database = require('./database'),
	utils = require('./utils');

function API(app) {
	app.get('/url/', this.getUrls);
	app.get('/url/:id/', this.getUrlSet);
	app.post('/url/', this.postUrl);
	app.put('/url/:id/desktop/', (req, res)=>{
		this.putUrl(req, res, 'desktopUrl');
	});
	app.put('/url/:id/tablet/', (req, res)=>{
		this.putUrl(req, res, 'tabletUrl');
	});
	app.put('/url/:id/mobile/', (req, res)=>{
		this.putUrl(req, res, 'mobileUrl');
	});
	app.get('/url/:id/desktop/', (req, res)=>{
		this.getUrl(req, res, 'desktopUrl');
	});
	app.get('/url/:id/tablet/', (req, res)=>{
		this.getUrl(req, res, 'tabletUrl');
	});
	app.get('/url/:id/mobile/', (req, res)=>{
		this.getUrl(req, res, 'mobileUrl');
	});
	app.get('/:code', this.redirect);
}

Object.defineProperties(API.prototype, {
	"getUrls": {
		value: function(req, res) {
			let db = new Database(config.databaseName),
				resUrls = new Array();

			db.start().then(function(result) {
				if(result.success)
					return db.all('select * from urlSets', []);
				else
					res.json({
						success: false,
						error: 'Could not start database'
					});
			}).then(function(result){
				if(result.success) {
					res.json(result.data);
				} else {
					res.json(result.error);
				}
			});
		}
	},
	"getUrlSet": {
		value: function(req, res) {
			let db = new Database(config.databaseName),
				urlSetModel = new UrlSetModel(),
				urlModel = new UrlModel(),
				desktopModel = new UrlModel(),
				tabletModel = new UrlModel(),
				mobileModel = new UrlModel();
				
			urlSetModel.id = req.params.id;
			
			db.start().then( function(result) {
				if(result.success)
					return urlSetModel.load(db);
				else
					res.json({
						success: false,
						error: 'Could not start database',
						id: urlSetModel.id
					});
			}).then(function(result){
				return urlSetModel.export(db);
			}).then(function(result){
				if(result.success) {
					res.json({ success: true, urlSet: result.data});
				} else {
					res.json({ success: false, error: "Could not find URL " + result.error, id: urlSetModel.id });
				}
			})
		}
	},
	"postUrl": {
		value: function(req, res) {
			
			let db = new Database(config.databaseName),
				urlModel = new UrlModel(),
				urlSetModel = new UrlSetModel();
				
				urlModel.url = req.body.url;

			db.start().then( function(result) {
				if(result.success)
					return urlModel.load(db);
				else
					res.json({
						success: false,
						error: 'Could not start database',
						id: urlSetModel.id
					});
			}).then( function(result) {
				if(!result.success && !!result.error) {
					res.json({
						success: false,
						error: result.error,
						id: urlSetModel.id
					});
				} else if(!result.success) {
					urlModel.createdDate = new Date();
					return urlModel.save(db);
				}
				return {success: true};
			} ).then( function(result) {
				
				if(!result.success)
					res.json({error: result.error});
				else {
					urlSetModel.url = urlModel.id;
					return urlSetModel.save(db);
				}	
			} ).then( function(result) {
				
				if(result.success) {
					urlSetModel.export(db).then(function(result){

						db.end();
						
						if(result.success)
							res.json({ success: true, urlSet: result.data});
						else
							res.json({ success: false, error: result.error});
					});
				} else {
					db.end();
					res.json({ success: false, error: "Could not save URL " + result.error, id: urlSetModel.id });
				}
			});
		}
	},
	"putUrl": { 
		value: function(req, res, label) {
			let db = new Database(config.databaseName),
				urlModel = new UrlModel(),
				urlSetModel = new UrlSetModel();
			
				urlSetModel.id = req.params.id;
				urlModel.url = req.body.url;
				
			db.start().then( function(result) {
				if(result.success)
					return urlSetModel.load(db);
				else
					res.json({
						success: false,
						error: 'Could not start database ' + result.error,
						id: urlSetModel.id
					});
			}).then( function(result) {
				if(result.success) {
					return urlModel.load(db);
				} else {
					res.json({
						success: false,
						error: 'Could not find URL',
						id: urlSetModel.id
					})
				}
			}).then( function(result) {
				if(result.success) {
					return result;
				} else if(!!result.error) {
					res.json({
						success: false,
						error: 'Could not load URL ' + result.error,
						id: urlSetModel.id
					});
				} else {
					urlModel.createdDate = new Date();
					return urlModel.save(db);
				}
			}).then( function(result) {
				if(!result.success)
					res.json({error: 'Could not save URL ' + result.error});
				else {
					urlSetModel[label] = urlModel.id;
					return urlSetModel.save(db);
				}
			} ).then( function(result) {
				if(result.success) {
					urlSetModel.export(db).then(function(result) {

						db.end();
					
						if(result.success)
							res.json({ success: true, urlSet: result.data});
						else
							res.json({ success: false, error: result.error});
					});
				} else {
					db.end();
					res.json({ success: false, error: "Could not save URL set " + result.error, id: urlSetModel.id });
				}
			});
		}
	},
	"getUrl": { 
		value: function(req, res, label) {
			let db = new Database(config.databaseName),
				urlModel = new UrlModel(),
				urlSetModel = new UrlSetModel();
			
				urlSetModel.id = req.params.id;
				urlModel.url = req.body.url;
				
			db.start().then( function(result) {
				if(result.success)
					return urlSetModel.load(db);
				else
					res.json({
						success: false,
						error: 'Could not start database ' + result.error,
						id: urlSetModel.id
					});
			}).then( function(result) {
				if(result.success) {
					urlModel.id = urlSetModel[label];
					return urlModel.load(db);
				} else {
					res.json({
						success: false,
						error: 'Could not find URL',
						id: urlSetModel.id
					})
				}
			}).then(function(result) {
				if(result.success) {
					let obj = {
						success: true
					}
					obj.url = urlModel.url;
					obj.redirects = urlModel.redirects;
					obj.createdDate = urlModel.createdDate;
					res.json(obj);
				} else {
					res.json({
						success: false,
						error: 'Could not find URL',
						id: urlSetModel.id
					})
				}
			});
		}
	},
	"redirect": {
		value: function(req, res) {
			let urlSetModel = new UrlSetModel(),
				urlModel = new UrlModel(),
				db = new Database(config.databaseName);
			urlSetModel.id = utils.fromBase62(req.params.code);
			db.start().then(function(result) {
				if(!!result.error) {
					res.json({error:result.error});
				} else {
					return urlSetModel.load(db);
				}
			}).then(function(result){
				if(!!result.error) {
					res.json({error:result.error});
				} else {
					let ua = req.headers['user-agent'],
						urlId = null;
					if(/iPhone/.test(ua) || (/Android/.test(ua) && /Mobile/.test(ua))) {
						urlId = !!urlSetModel.mobileUrl ? urlSetModel.mobileUrl : urlSetModel.url;
					} else if(/iPad/.test(ua) || /Android/.test(ua)) {
						urlId = !!urlSetModel.tabletUrl ? urlSetModel.tabletUrl : urlSetModel.url;
					} else {
						urlId = !!urlSetModel.desktopUrl ? urlSetModel.desktopUrl : urlSetModel.url;
					}
					urlModel.id = urlId;
					return urlModel.load(db);
				}
			}).then(function(result){
				if(!!result.error) {
					res.json({error:result.error});
				} else {
					urlModel.redirects = urlModel.redirects + 1;
					return urlModel.save(db);
				}
			}).then(function(result) {
				res.redirect(urlModel.url);
			});
		}
	}
});

module.exports = API;