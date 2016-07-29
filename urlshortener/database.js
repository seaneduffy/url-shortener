'use strict';

let sqlite3 = require('sqlite3').verbose(),
	Database = function(databaseName){
		this.databaseName = databaseName;
	};
	
Object.defineProperties(Database.prototype, {
	"start": {
		value: function() {
			
			let database = this;
			return new Promise((resolve, reject)=>{
				database.db = new sqlite3.Database(database.databaseName);
				database.checkTable('urlSets').then( function(result) {
					if(result.success) {
						return result;
					} else if(!!result.error) {
						resolve(result);
					} else {
						return database.createTable('urlSets', [
							'id integer primary key', 
							'url integer',
							'code varchar(100)', 
							'desktopUrl integer', 
							'tabletUrl integer', 
							'mobileUrl integer']);
						}
				}).then( function(result) {
					if(result.success) {
						return database.checkTable('urls');
					} else {
						resolve(result);
					}
				}).then( function(result) {
					if(result.success)
						return({success: true});
					else if(!!result.error)
						resolve(result);
					else return database.createTable('urls', [
						'id integer primary key', 
						'url varchar(500)',
						'redirects integer',
						'createdDate varchar(500)']);
				}).then( function(result) {
					if(result.success) {
						resolve({success: true});
					} else {
						resolve(result);
					}
				});
			});
		}
	},
	"checkTable": {
		value: function(table) {
			return this.get("SELECT name FROM sqlite_master WHERE type='table' AND name='"+table+"'", []);
		}
	},
	"createTable": {
		value: function(table, values) {
			let query = 'create table '+table+' ('+values[0];
			values.forEach((value, index)=>{
				if(index !== 0)
					query += ','+value;
			});
			query+= ');';
			return this.run(query, []).then(function(){
				return {success: true};
			});
		}
	},
	"end": {
		value: function() {
			this.db.close();
		}
	},
	"get": {
		value: function(query, values) {
			
			let db = this.db;
			
			return new Promise(function(resolve, reject) {
				db.get(query, values, function(err, row) {
					if(!!err) {
						resolve({success: false, error: err});
					} else {
						if(!!row) {
							resolve({success: true, data:row});
						} else {
							resolve({success: false});
						}	
					}
				});
			});
		}
	},
	"all": {
		value: function(query, values) {
			let db = this.db;
			
			return new Promise(function(resolve, reject) {
				db.all(query, values, function(err, rows) {
					if(!!err) {
						resolve({success:false, error:err});
					} else {
						resolve({success:true, data:rows});
					}
				});
			});
		}
	},
	"run": {
		value: function(query, values) {
			
			let db = this.db
			
			return new Promise(function(resolve, reject) {
				db.run(query, values, function(err) {
					if(!!err)
						resolve({success:false, error:err});
					resolve({success:true, data:this});
				});
			});
		}
	}
});

module.exports = Database;