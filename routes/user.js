const express = require('express');
let router = express.Router();
var atob = require('atob');

router.get('/getProfile/:userid',function(req,res){
	var db = req.app.get('db');
	var userid = req.params.userid;
	var auth = req.headers.authentication;
	var decodedValue = atob(auth);
	var userInfo = decodedValue.split(":");

	// var result = { has_profile: true, errors: ""};
	var result = { profile: true, errors: ""};

	let sql = 'SELECT * FROM appuser WHERE id=$1 AND password=$2;';
	db.all(sql,[userInfo[0], userInfo[1]], (err, rows) => {
		if (err) {
				result.profile = false;
				result.errors = err.message;
		} else {
			if (rows.length == 0) {
				result.profile = false;
			} else {
				result.profile = rows;
			}
		}
		res.json(result);
	});
});

router.put('/updateProfileId/:userid',function(req,res){
	var db = req.app.get('db');
	console.log("GOOD ROUTE");
	var newId = req.body.id;
	var newPass = req.body.pass;

	var userid = req.params.userid;
	var auth = req.headers.authentication;
	var decodedValue = atob(auth);
	var userInfo = decodedValue.split(":");

	// var result = { has_profile: true, errors: ""};
	var result = { profile: true, errors: ""};
	var sql = 'SELECT * FROM appuser WHERE id=$1 AND password=$2;';
	db.all(sql,[userInfo[0], userInfo[1]], (err, rows) => {
		if (err) {
				result.profile = false;
				result.errors = err.message;
		} else {
			if (rows.length == 0) {
				console.log("NADA");
				result.profile = false;
			}
		}
	});


	if (result.profile) {
		var sql = 'UPDATE appuser SET id=$1 WHERE id=$2;';
		db.run(sql,[newId,userInfo[0]], (err, rows) => {
			if (err) {
				result.profile = false;
				result.errors = err.message;
			} else {
				sql = 'UPDATE appuser SET password=$1 WHERE id=$2;';
				db.run(sql,[newPass,userInfo[0]], (err, rows) => {
					if (err) {
						result.profile = false;
						result.errors = err.message;
					}
				});
			}
		});
	}
	res.json(result);
});


router.post('/updateScore/:userid',function(req,res){
	var db = req.app.get('db');
	var result = { authentication_status: true, errors: ""};
	var userid = req.params.userid;
	var auth = req.headers.authentication;
	var decodedValue = atob(auth);

	var score = req.body.score;
	var time = req.body.time;
	var userInfo = decodedValue.split(":");

	let sql = 'SELECT * FROM appuser WHERE id=$1 AND password=$2;';
	db.all(sql,[userInfo[0], userInfo[1]], (err, rows) => {
		if (err) {
				result.authentication_status = false;
    			result.errors = err.message;
  		} else {
			if (rows.length == 0) {
				result.authentication_status = false;
			}
		}
	});
	if (result.authentication_status) {
		let sql = 'INSERT INTO userScores VALUES($1,$2,$3);';
		db.run(sql,[userInfo[0],score,time], (err, rows) => {
			if (err) {
				result.authentication_status = false;
				result.errors = err.message;
			}
		});
	}
	res.json(result);
});

module.exports = router;
