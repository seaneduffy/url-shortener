var request = require("request"),
	devUrl = "http://localhost:3000/",
	urlToShorten = "https://facebook.com/",
	urlDesktop = "https://www.facebook.com/",
	urlMobile = "https://m.facebook.com/",
	urlTablet = "https://m.facebook.com/";

describe("API", function() {
	
	describe("POST /url/", function() {
		
		var response,
			error,
			body,
			json;
		
		beforeEach(function(done) {
			request({
				url: devUrl + 'url', 
				method: 'post',
				headers: {'content-type': 'application/json'},
				body: JSON.stringify({url: urlToShorten}),
			}, function($error, $response, $body) {
				error = $error;
				response = $response;
				body = $body;
				json = JSON.parse(body);
				done();
			});
		});
		
	    it("returns JSON object containing URL set information", function(done) {
			expect(response.statusCode).toBe(200);
			expect(json.success).toBe(true);
			expect(json.urlSet.code).toBe('b');
			expect(json.urlSet.defaultUrl.url).toBe(urlToShorten);
			done();
		});
	});
	
	describe("PUT /url/1/desktop", function() {
		var response,
			error,
			body,
			json;
	
		beforeEach(function(done) {
			request({
				url: devUrl + 'url/1/desktop', 
				method: 'put',
				headers: {'content-type': 'application/json'},
				body: JSON.stringify({url: urlDesktop}),
			}, function($error, $response, $body) {
				error = $error;
				response = $response;
				body = $body;
				json = JSON.parse(body);
				done();
			});
		});
	
	    it("returns JSON object containing URL set information", function(done) {
			expect(response.statusCode).toBe(200);
			expect(json.success).toBe(true);
			expect(json.urlSet.code).toBe('b');
			expect(json.urlSet.desktopUrl.url).toBe(urlDesktop);
			done();
		});
	});
	
	describe("PUT /url/1/tablet", function() {
		var response,
			error,
			body,
			json;
	
		beforeEach(function(done) {
			request({
				url: devUrl + 'url/1/tablet', 
				method: 'put',
				headers: {'content-type': 'application/json'},
				body: JSON.stringify({url: urlTablet}),
			}, function($error, $response, $body) {
				error = $error;
				response = $response;
				body = $body;
				json = JSON.parse(body);
				done();
			});
		});
	
	    it("returns JSON object containing URL set information", function(done) {
			expect(response.statusCode).toBe(200);
			expect(json.success).toBe(true);
			expect(json.urlSet.code).toBe('b');
			expect(json.urlSet.tabletUrl.url).toBe(urlTablet);
			done();
		});
	});
	
	describe("PUT /url/1/mobile", function() {
		var response,
			error,
			body,
			json;
	
		beforeEach(function(done) {
			request({
				url: devUrl + 'url/1/mobile', 
				method: 'put',
				headers: {'content-type': 'application/json'},
				body: JSON.stringify({url: urlMobile}),
			}, function($error, $response, $body) {
				error = $error;
				response = $response;
				body = $body;
				json = JSON.parse(body);
				done();
			});
		});
	
	    it("returns JSON object containing URL set information", function(done) {
			expect(response.statusCode).toBe(200);
			expect(json.success).toBe(true);
			expect(json.urlSet.code).toBe('b');
			expect(json.urlSet.mobileUrl.url).toBe(urlMobile);
			done();
		});
	});
	
	describe("GET /url/1", function() {
		
		var response,
			error,
			body,
			json;
		
		beforeEach(function(done) {
			request({
				url: devUrl + 'url/1', 
				method: 'get',
				headers: {'content-type': 'application/json'},
			}, function($error, $response, $body) {
				error = $error;
				response = $response;
				body = $body;
				json = JSON.parse(body);
				done();
			});
		});
		
	    it("returns JSON object containing URL set information", function(done) {
			expect(response.statusCode).toBe(200);
			expect(json.success).toBe(true);
			expect(json.urlSet.defaultUrl.url).toBe(urlToShorten);
			expect(json.urlSet.desktopUrl.url).toBe(urlDesktop);
			expect(json.urlSet.tabletUrl.url).toBe(urlTablet);
			expect(json.urlSet.mobileUrl.url).toBe(urlMobile);
			expect(json.urlSet.code).toBe('b');
			done();
		});
	});
});