const con = require('../config');
const bodyParser = require('body-parser');
const mailer = require('nodemailer');

exports.add = function(req,res){
	const committee = req.body.committee;
	const tName = req.session.user.event + '_committee';
	let que = `INSERT INTO ${tName} (committee_name) VALUES('${committee}')`;
	con.query(que,(qerr,qres) => {
		if(qerr){
			throw(qerr);
		}
	});
	//res.redirect('/committee/' + committee);
	res.redirect('/main');
}

exports.invite = function(req,res){
	var sender = mailer.createTransport({
		service : 'gmail',
		auth: {
			user: 'abhijeetmathur786@gmail.com',
			pass: 'Anujay786'
		},
		tls: {
        	rejectUnauthorized: false
    	}
	});
	let url = `http://localhost:3000/signup?q1=${req.session.user.event}&q2=${req.body.committee}`;
	var mail = {
		from : 'abhijeetmathur786@gmail.com',
		to : req.body.email,
		subject : `Invitation to ${req.session.user.event}`,
		text : `Your Invitation link : ${url}`
	};

	sender.sendMail(mail,(error,msg) => {
		if(error){
			console.log(error);
			sender.close();
		}
		else {
			console.log('Success: ' + msg.response);
			sender.close();
		}
	});
	res.redirect('/main');
}

exports.assignwork = function(req,res){
	var committee = req.params.name;
	res.render('add',{
		committeeName:committee
	});
}

exports.addwork = function(req,res){
	const committee = req.body.committee;
	const work = req.body.work;
	const assignee_name = req.body.assignee;
	const description = req.body.description;
	const difficulty = req.body.difficulty;
	const tName2 = req.session.user.event + '_work';
    // console.log("the value id"+tName2);
	let que = `INSERT INTO ${tName2}(heading,description,committee,assignee,difficulty,created) VALUES('${work}',"${description}",'${committee}','${assignee_name}','${difficulty}',NOW())`;
	con.query(que,(qerr,qres)=>{
		if(qerr)
		console.log(qerr);

	}); 
    res.redirect('/committee/'+committee+'/allWork');
}

exports.propose = function(req,res){
	const committee = req.body.committee;
	const work = req.body.work;
	const event = req.body.event;
	if(req.body.propose){
		let que = `UPDATE ${event}_work SET proposed = 1 WHERE heading = '${work}' AND committee = '${committee}'`;
		con.query(que,(qerr,qres)=>{
			if(qerr)
				console.log(qerr);
			res.redirect('/committee/'+committee);
		});
	}
	else if(req.body.cant){
		let que = `UPDATE ${event}_work SET proposed = -1 WHERE heading = '${work}' AND committee = '${committee}'`;
		con.query(que,(qerr,qres)=>{
			if(qerr)
				console.log(qerr);
			res.redirect('/committee/'+committee);
		});
	}
}

exports.close = function(req,res){
	const committee = req.body.committee;
	const work = req.body.work;
	const event = req.session.user.event;
	if(req.body.close){
		let que = `SELECT assignee,difficulty FROM ${event}_work WHERE heading = '${work}' AND committee = '${committee}'`;
		let que1 = '';
		con.query(que,(err,results,fields)=>{
			if(err)
				console.log(err);
			if(results[0].difficulty.toLowerCase() == 'easy')
				que1 = `UPDATE ${event} SET points = points+1 WHERE name = '${results[0].assignee}'`;
			else if(results[0].difficulty.toLowerCase() == 'average')
				que1 = `UPDATE ${event} SET points = points+2 WHERE name = '${results[0].assignee}'`;
			else if(results[0].difficulty.toLowerCase() == 'hard')
				que1 = `UPDATE ${event} SET points = points+3 WHERE name = '${results[0].assignee}'`;
			con.query(que1,(qerr,qres)=>{
				if(qerr)
					console.log(qerr);
			});
		});
		que = `UPDATE ${event}_work SET complete = 1,proposed=0 WHERE heading = '${work}' AND committee = '${committee}'`;
		con.query(que,(qerr,qres)=>{
			if(qerr)
				console.log(qerr);
			res.redirect('/committee/'+committee+'/proposedWork');
		});
	}
	else if(req.body.change){
		const assignee = req.body.assignee;
		que = `UPDATE ${event}_work SET assignee = '${assignee}',proposed=0 WHERE heading = '${work}' AND committee = '${committee}'`;
		con.query(que,(qerr,qres)=>{
			if(qerr)
				console.log(qerr);
			res.redirect('/committee/'+committee+'/proposedWork');
		});
	}
	else if(req.body.reopen){
		const assignee = req.body.assignee;
		que = `UPDATE ${event}_work SET proposed=0 WHERE heading = '${work}' AND committee = '${committee}'`;
		con.query(que,(qerr,qres)=>{
			if(qerr)
				console.log(qerr);
			res.redirect('/committee/'+committee+'/proposedWork');
		});
	}
}

exports.deleteWork = function(req,res){
	const committee = req.body.committee;
	const work = req.body.work;
	const event = req.session.user.event;
	que = `DELETE FROM ${event}_work WHERE heading = '${work}' AND committee = '${committee}'`;
	con.query(que,(qerr,qres)=>{
		if(qerr)
			console.log(qerr);
		res.redirect('/committee/'+committee+'/allWork');
	});
}

exports.response = function(req,res){
	var sender = mailer.createTransport({
		service : 'gmail',
		auth: {
			user: 'abhijeetmathur786@gmail.com',
			pass: 'Anujay786'
		},
		tls: {
        	rejectUnauthorized: false
    	}
	});
	let url = ` ${req.body.response}`;
	var mail = {
		from : 'abhijeetmathur786@gmail.com',
		to : 'abhijeetmathur786@gmail.com',
		subject : `Response`,
		text : `User response : ${url}`
	};

	sender.sendMail(mail,(error,msg) => {
		if(error){
			console.log(error);
			sender.close();
		}
		else {
			console.log('Success: ' + msg.response);
			sender.close();
		}
	});
	res.redirect('/feedback');
}