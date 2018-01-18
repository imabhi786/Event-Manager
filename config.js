const mysql = require('mysql');

const con = mysql.createConnection({
	host : "localhost",
	user : "root",
	password : "pass",
	database : "Event-Manager"
});

module.exports = con;