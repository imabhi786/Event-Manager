const con = require('../config');

exports.head = function(req,res){
	if(req.session && req.session.user){
		if(req.session.user.committee=='head'){
			let tName = req.session.user.event + '_committee';
			let tName2 = req.session.user.event + '_work';
			var rWorks = {};

			let que = `SELECT heading,description,committee FROM ${tName2} ORDER BY created DESC LIMIT 5`;
			con.query(que,(err,results,fields) => {
				if(err){
					throw(err);
				}
				rWorks = results;
			});

			que = `SELECT committee_name AS name FROM ${tName}`;

			con.query(que,(err,results,fields) => {
				if(err){
					throw(err);
				}
				let committee = results;
				res.render('head',{
					eventName: req.session.user.event,
					currentUser : req.session.user.name,
					committee: committee,
					works : rWorks
				});
			});
		}
		else{
			res.redirect('/committee/' + committee);
		}
	}
	else{
		req.session.destroy();
		res.redirect('/');
	}
};

exports.signup = function(req,res){
	if(req.query.q1 && req.query.q2){
		let event = req.query.q1;
		let committee = req.query.q2;
		res.render('signup',{
			event: event,
			committee: committee
		});
	}
	else{
		res.redirect('/create');
	}
}

exports.login = function(req,res){
	res.render('login',{
		err: req.query.err
	});
}

exports.yourWork = function(req,res){
	const committee = req.params.name;
	if(req.session && req.session.user){
		if(committee == req.session.user.committee){
			let tName2 = req.session.user.event + '_work';
			let que = `SELECT * FROM ${tName2} WHERE assignee='${req.session.user.name}' ORDER BY complete ASC,created DESC`;
			con.query(que,(err,results,fields) => {
				if(err)
					console.log(err);
				results = results.map((x) => {
					let created = new Date(x.created);
					let curDate = new Date();
					x.duration = Math.floor((curDate - created) / (1000));
					if(x.duration >= 86400){
						x.duration = Math.floor(x.duration/86400) + ' days';
						return x;
					}
					else if(x.duration >= 3600){
						x.duration = Math.floor(x.duration/3600) + ' hours';
						return x;
					}
					else if(x.duration >= 60){
						x.duration = Math.floor(x.duration/60) + ' minutes';
						return x;
					}
					else
						x.duration = x.duration + ' seconds';
						return x;
				});
				res.render('yourWork',{
					event: req.session.user.event,
					committeeName: committee,
					committee: req.session.user.committee,
					works: results,
					currentUser : req.session.user.name
				});
			});
		}
		else if(req.session.user.committee == 'head'){
			res.redirect('/committee/' + committee + '/allWork');
		}
	}
	else{
		req.session.destroy();
		res.redirect('/');
	}
}

exports.allWork = function(req,res){
	// console.log(req.session.user);
	let path = req.originalUrl.split('/');
	const committee = path[2];
	if(req.session && req.session.user){
		if(committee == req.session.user.committee || req.session.user.committee == 'head'){
			let tName2 = req.session.user.event + '_work';
			let que = `SELECT * FROM ${tName2} WHERE committee = '${committee}' AND complete=0 ORDER BY created DESC`;
			con.query(que,(err,results,fields) => {
				if(err)
					console.log(err);
				results = results.map((x) => {
					let created = new Date(x.created);
					let curDate = new Date();
					x.duration = Math.floor((curDate - created) / (1000));
					if(x.duration >= 86400){
						x.duration = Math.floor(x.duration/86400) + ' days';
						return x;
					}
					else if(x.duration >= 3600){
						x.duration = Math.floor(x.duration/3600) + ' hours';
						return x;
					}
					else if(x.duration >= 60){
						x.duration = Math.floor(x.duration/60) + ' minutes';
						return x;
					}
					else
						x.duration = x.duration + ' seconds';
						return x;
				});
				res.render('allWork',{
					event: req.session.user.event,
					committeeName: committee,
					committee: req.session.user.committee,
					works: results,
					currentUser: req.session.user.name.toLowerCase()  //-------Remember to CHANGE---------//
				});
			});
		}
		else{
			res.redirect('/committee/' + committee);
		}
	}
	else{
		req.session.destroy();
		res.redirect('/');
	}
}

exports.closedWork = function(req,res){
	let path = req.originalUrl.split('/');
	const committee = path[2];
	if(req.session && req.session.user && (committee == req.session.user.committee || req.session.user.committee == 'head')){
		let tName2 = req.session.user.event + '_work';
		let que = `SELECT * FROM ${tName2} WHERE committee = '${committee}' AND complete=1 ORDER BY created DESC`;
		con.query(que,(err,results,fields) => {
			if(err)
				console.log(err);
			results = results.map((x) => {
				let created = new Date(x.created);
				let curDate = new Date();
				x.duration = Math.floor((curDate - created) / (1000));
				if(x.duration >= 86400){
					x.duration = Math.floor(x.duration/86400) + ' days';
					return x;
				}
				else if(x.duration >= 3600){
					x.duration = Math.floor(x.duration/3600) + ' hours';
					return x;
				}
				else if(x.duration >= 60){
					x.duration = Math.floor(x.duration/60) + ' minutes';
					return x;
				}
				else
					x.duration = x.duration + ' seconds';
					return x;
			});
			res.render('closedWork',{
				event: req.session.user.event,
				committeeName: committee,
				committee: req.session.user.committee,
				works: results,
				currentUser : req.session.user.name
			});
		});
	}
	else{
		req.session.destroy();
		res.redirect('/');
	}
}

exports.proposedWork = function(req,res){
	let path = req.originalUrl.split('/');
	const committee = path[2];
	if(req.session && req.session.user){ 
		if(req.session.user.committee == 'head'){
			let tName2 = req.session.user.event + '_work';
			let que = `SELECT * FROM ${tName2} WHERE (committee = '${committee}') AND (proposed=-1 OR proposed=1) ORDER BY created DESC`;
			con.query(que,(err,results,fields) => {
				if(err)
					console.log(err);
				results = results.map((x) => {
					let created = new Date(x.created);
					let curDate = new Date();
					x.duration = Math.floor((curDate - created) / (1000));
					if(x.duration >= 86400){
						x.duration = Math.floor(x.duration/86400) + ' days';
						return x;
					}
					else if(x.duration >= 3600){
						x.duration = Math.floor(x.duration/3600) + ' hours';
						return x;
					}
					else if(x.duration >= 60){
						x.duration = Math.floor(x.duration/60) + ' minutes';
						return x;
					}
					else
						x.duration = x.duration + ' seconds';
						return x;
				});
				res.render('propsedWork',{
					event: req.session.user.event,
					committeeName: committee,
					committee: req.session.user.committee,
					works: results,
					currentUser: req.session.user.name.toLowerCase()  //-------Remember to CHANGE---------//
				});
			});
		}
		else{
			res.redirect('/committee/' + committee);
		}
	}
	else{
		res.redirect('/');
	}
}

exports.leaderboard = function(req,res){
	if(req.session && req.session.user){
		let rCommittee = req.params.leaderboard;
		let committee = req.session.user.committee;
		if(committee == 'head' || committee == rCommittee){
			let event = req.session.user.event;
			let que = `SELECT name,email,points FROM ${event} WHERE committee = '${rCommittee}' ORDER BY points DESC,name ASC`;
			con.query(que,(err,results,fields) => {
				if(err)
				throw err;
				res.render('leaderboard',{
					event: req.session.user.event,
					committeeName: rCommittee,
					committee: req.session.user.committee,
					board: results,
					currentUser: req.session.user.name  //-------Remember to CHANGE---------//
				});
			});
		}
		else{
			res.redirect('/committee/' + committee);
		}
	}
	else{
		req.session.destroy();
		res.redirect('/');
	}
}

exports.profile = function(req,res){
	if(req.session && req.session.user){
		var comm = req.params.committeeName;
		var event = req.session.user.event;
		let que =`SELECT * FROM ${event} WHERE name = '${comm}'`;
		con.query(que,function(err,results,fields){
			if(err)
			throw err;
			res.render('profile',{
				EventName:event,
				currentUser:results[0].name,
				UserEmail:results[0].email,
				committee:results[0].committee,
				mobile:results[0].mobile,
				points:results[0].points
			});
		});
	}
	else{
		req.session.destroy();
		res.redirect('/');
	}
}