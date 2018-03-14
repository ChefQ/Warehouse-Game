require('./port');

var express = require('express');
var bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

var app = express();
var user = require('./routes/user.js');
var index = require('./routes/index.js');

// http://www.sqlitetutorial.net/sqlite-nodejs/connect/
// https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// http://www.sqlitetutorial.net/sqlite-nodejs/connect/
// will create the db if it does not exist
var db = new sqlite3.Database('db/database.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the database.');
});
// Set a variable db to our database for our routes to access them
app.set('db',db);

// https://expressjs.com/en/starter/static-files.html
app.use(express.static('static-content'));

// Api routing (login/register)
app.use('/api',index);
// User specific routing (update profile ...etc)
app.use('/user',user);

app.use(function(err, req, res, next) {
  // Do logging and user-friendly error message display
  console.error(err);
  res.status(500).send('internal server error');
})

app.listen(port, function () {
  	console.log('Example app listening on port '+port);
});

// db.close();
