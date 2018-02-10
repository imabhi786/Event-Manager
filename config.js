const mysql = require('mysql');

const con = mysql.createConnection({
	host : "localhost",
	user : "root",
	password : "Anujay786",
	database : "event_manager"
});

module.exports = con;