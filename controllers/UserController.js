var mysql = require('mysql');
var bcrypt = require('bcryptjs');
'use strict'
const vision = require('node-cloud-vision-api')
var mensaje;

module.exports = {

	getSignUp : function(req, res, next){
		return res.render('users/signup');
	},

	postSignUp: function(req, res, next){
		
		var salt = bcrypt.genSaltSync(10);
		var password = bcrypt.hashSync(req.body.password, salt);

		var user = {
			email : req.body.email,
			nombre : req.body.nombre,
			password : password
		};

		var config = require('.././database/config');

		var db = mysql.createConnection(config);

		db.connect();

		db.query('INSERT INTO users SET ?', user, function(err, rows, fields){
			if(err) throw err;

			db.end();
		});
		req.flash('info', 'Se ha registrado correctamente, ya puede iniciar sesion');
		return res.redirect('/auth/signin');
	},

	getSignIn: function(req, res, next){
		return res.render('users/signin', {message: req.flash('info'), authmessage : req.flash('authmessage')});
	},

	logout : function(req, res, next){
		req.logout();
		res.redirect('/auth/signin');
	},

	getUserPanel : function(req, res, next){


		res.render('users/panel', {
			isAuthenticated : req.isAuthenticated(),
			user : req.user,
			message : req.flash('detalles')
		});
	},

	postUserPanel : function(req, res, next){
		var im = req.body.imagen;

		console.log(im);

		// autentificacion
		vision.init({auth: 'AIzaSyC9eUegNGqOhI8XaKZLTeKSEW3vQty-MKk'})

		// construct parameters
		const req2 = new vision.Request({
  		image: new vision.Image('./img/'+im),
  		features: [
    		new vision.Feature('FACE_DETECTION', 4),
    		new vision.Feature('LABEL_DETECTION', 10),
  		]
		})

		// send single request
		vision.annotate(req2).then((res3) => {
  		// handling response
  		console.log(JSON.stringify(res3.responses))  		
  		res.render('users/panel', {
			isAuthenticated : req.isAuthenticated(),
			user : req.user,
			message : JSON.stringify(res3.responses)
		});
  		
		}, (e) => {
 		 console.log('Error: ', e)
		})

		
		return;
	}

};