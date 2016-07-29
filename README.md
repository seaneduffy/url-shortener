API for creation and retrieval of shortened URLs

#About
This application utilizes [Express](https://github.com/expressjs/express) and [Node Sqlite3](https://github.com/mapbox/node-sqlite3). Essentially, the application wraps node-sqlite3 in promises and includes models for saving a set of device specific URLs related to a default URL. 

When a new URL is submitted, a URL set is created, and a base 62 code is created for the set. When a user navigates to the site domain with the code (ex: http://localhost/cba54), they will be redirected to the appropriate URL depending on their device. If a URL for the device has not been set, they will be redirected to the default URL.

The application tracks the redirects to each URL as well as their creation date. It assumes if a URL is submitted multiple times, it is referring to the same URL, so a new record for that URL is not created.

#Installation

Installing locally is easy. Make sure you have [Node](https://nodejs.org/en/download/) and [Sqlite3](http://www.sqlite.org/download.html) installed.

```
cd url-shortener
npm install

// Start server
npm start

// Test server
npm start
npm test
```

#API

##get /url/
Retrieve all sets of URLs that have been submitted.
##get /url/:id/
Retrieve URL set with ID param
##post /url/
Submit new default URL to create a new URL set. The body of the request must match the format:
```
{ url: 'submitted_url' }
```
A shortened code of base 62 will be generated for the new URL set.
##put /url/:id/desktop/
Set URL that will be redirected to when user navigates to the host domain with the corresponding set's code on a desktop device. The body of the request must match the format:
```
{ url: 'desktop_url' }
```
##put /url/:id/tablet/
Set URL that will be redirected to when user navigates to the host domain with the corresponding set's code on a tablet. The body of the request must match the format:
```
{ url: 'desktop_url' }
```
##put /url/:id/mobile/
Set URL that will be redirected to when user navigates to the host domain with the corresponding set's code on a mobile device. The body of the request must match the format:
```
{ url: 'desktop_url' }
```
##get /url/:id/desktop/
Retrieve the desktop URL for the submitted URL set.
##get /url/:id/tablet/
Retrieve the tablet URL for the submitted URL set.
##get /url/:id/mobile/
Retrieve the mobile URL for the submitted URL set.