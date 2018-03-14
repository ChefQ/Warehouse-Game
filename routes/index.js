const express = require('express');
let router = express.Router();

router.get('/getHighScores',function(req,res){
	var result = { highscores: true, errors: ""};
	let sql = 'SELECT * FROM userScores ORDER BY score DESC LIMIT 10';
	var db = req.app.get('db');
	db.all(sql, (err, rows) => {
		if (err) {
			result.highscores = false;
			result.errors = err.message;
		} else {
			if (rows.length == 0) {
				result.highscores = false;
			}
			result.highscores = rows;
		}
		res.json(result);
	});
});

router.post('/login/', function (req, res) {

	var db = req.app.get('db');
	var user = req.body.user;
	var pass = req.body.pass;
	// var auth = req.headers.authentication;

	var result = { login_status: true, errors: ""};
	// http://www.sqlitetutorial.net/sqlite-nodejs/query/
	// let sql = 'SELECT * FROM appuser WHERE id=' + user + ' AND password=$2;';

	let sql = 'SELECT * FROM appuser WHERE id=$1 AND password=$2;';
	db.all(sql,[user,pass], (err, rows) => {
	// db.all(sql, (err, rows) => {
  		if (err) {
    			result.errors = err.message;
  		} else {
			if (rows.length != 0) {
				result.login_status = true;
			} else {
				result.login_status = false;
			}
		}
		res.json(result);
	});

});

router.post('/register', function (req, res) {
	var db = req.app.get('db');
	var user = req.body.user;
	var pass = req.body.pass;

	var result = { register_status: true, errors: ""};
	// http://www.sqlitetutorial.net/sqlite-nodejs/query/
	let sql = 'SELECT * FROM appuser WHERE id=$1;';
	db.all(sql,[user], (err, rows) => {
  		if (err) {
    			result.errors = err.message;
  		} else {
			if (rows.length != 0) {
				result.register_status = false;
			} else {
				let sql = 'INSERT INTO appuser VALUES($1,$2,$3);';
				db.run(sql,[user,pass,""])
			}
		}
		res.json(result);
	});

});

module.exports = router;
