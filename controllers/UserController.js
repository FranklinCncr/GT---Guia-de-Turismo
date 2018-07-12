#!/usr/bin/env node
var mysql = require('mysql');
var Crawler = require("crawler");
var bcrypt = require('bcryptjs');
'use strict'
const vision = require('node-cloud-vision-api')
var mensaje;
//const say = require('say');
// Imports the Google Cloud client library



// Your Google Cloud Platform project ID


module.exports = {

	getSignUp : function(req, res, next){
		return res.render('users/signup');
	},

	postSignUp: function(req, res, next){

		if(req.file){
			//console.log(req.file);
			req.body.imagen = req.file.filename;			
		}			
		
		var img = req.body.imagen;

		var salt = bcrypt.genSaltSync(10);
		var password = bcrypt.hashSync(req.body.password, salt);
		//var img = "user.jpg";
		var f = new Date();
		var date = f.getFullYear()+"/" + (f.getMonth() +1) + "/" + f.getDate();


		var user = {
			email : req.body.email,
			nombre : req.body.nombre,
			password : password,
			imagen : '/images/'+img,
			fecha : date
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

		//say.speak('Bienvenido '+ req.user.nombre +' seleccione una imagen');


		res.render('users/panel', {
			isAuthenticated : req.isAuthenticated(),
			user : req.user,
			message : req.flash('detalles')
		});

	},

	postUserPanel : function(req, res, next){

		//say.speak('Inciando busqueda');
		
		

		if(req.file){
			//console.log(req.file);
			req.body.imagen = req.file.filename;			
		}
				
		//console.log(req.body.imagen);
		var im = req.body.imagen;
		

		// autentificacion
		vision.init({auth: 'AIzaSyC9eUegNGqOhI8XaKZLTeKSEW3vQty-MKk'})

		// construct parameters
		const req3 = new vision.Request({
  		image: new vision.Image('./public/images/'+im),
  		features: [
  			new vision.Feature('LANDMARK_DETECTION', 10)    		
  		]
		})

		// send single request
		vision.annotate(req3).then((res3) => {
  		// handling response
  		
  		//PARSER
  		
  		var landMark = JSON.stringify(res3.responses);
  		var ilat = landMark.search("latitude");
  		var ilon = landMark.search("longitude");
  		var i = landMark.search("description");
  		var j = landMark.search("score");
  		var nombreLugar = landMark.substring(i+14,j-3);
  		var latitude = landMark.substring(ilat+10,ilat+19);
  		var longitude = landMark.substring(ilon+11,ilon+20);
  		//console.log(landMark);
  		//console.log(latitude);
  		//console.log(longitude);
  		var salida = "";
  		 		 		

		//CRAWLER
		
		var c = new Crawler({
    		maxConnections : 1,
    		// This will be called for each crawled page
    		callback : function (error, res, done) {
        		if(error){
            		console.log(error);
        		}else{
            		var $ = res.$;
            		// $ is Cheerio by default
            		//a lean implementation of core jQuery designed specifically for the server

            		//console.log($("title").text());
        		}
		        done();
		    }
		});

		
		// Queue URLs with custom callbacks & parameters
		c.queue([{
		    uri: 'https://es.wikipedia.org/wiki/'+ nombreLugar,
		    jQuery: false,

		    // The global callback won't be called
		    callback: function (error, res, done) {
		        if(error){
		            console.log(error);
		        }else{
		            	            
		            var codehtml = JSON.stringify(res.body);
		            var inicio = codehtml.search("<p>");
		            var codehtml = codehtml.substring(inicio+3,inicio+5000);
		            var fin = codehtml.search("</p>")+4;		            
		            var codehtml = codehtml.substring(0,fin);		            		            

		            //say.speak(nombreLugar);

		            //console.log(codehtml);
		            
		            var texto;
		            
		            //console.log(istring);
		            var fstring;
		            

		            while(istring != -1){
		            	var istring = codehtml.search("<a");
		            	
		            	salida = codehtml.substring(0,istring);
		            	//console.log(salida);
		            	fstring = codehtml.search("\">");
		            	fin = codehtml.search("</p>");
		            	codehtml = codehtml.substring(fstring+2,fin+4);
		            	salida += codehtml;

		            	//console.log(salida);

		            	fstring = salida.search("</a>");
		            	fin = salida.search("</p>");
		            	texto = salida.substring(0,fstring);
		            	salida = salida.substring(fstring+4,fin+4);
		            	salida = texto+salida;

		            	//console.log(salida);
		            	codehtml = salida;		            	

		            	istring = salida.search("<a");

		            }
		            salida = salida.substring(0,fin-6);
		            var salida2 = nombreLugar+" "+salida;
		            //say.speak(salida2);


var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var fs=require("fs");

var textToSpeech = new TextToSpeechV1({
  username: '0c0fa62c-b98e-48cc-a40c-b9565afda323',
  password: '4UAZxpyPPfRN',		
  url: 'https://stream.watsonplatform.net/text-to-speech/api'  
});

var params = {
  text: salida2,
  voice: 'es-LA_SofiaVoice', // Optional voice
  accept: 'audio/wav'
};
var wav = './public/'+nombreLugar+'.wav';
// Synthesize speech, correct the wav header, then save to disk
// (wav header requires a file length, but this is unknown until after the header is already generated and sent)
textToSpeech
  .synthesize(params, function(err, audio) {
    if (err) {
      console.log(err);
      return;
    }
    textToSpeech.repairWavHeader(audio);
    fs.writeFileSync(wav, audio);
    //console.log('audio.wav written with a corrected wav header');
});

		            //console.log(salida);

		            //fecha actual
		            var f = new Date();
					var date = f.getFullYear()+"/" + (f.getMonth() +1) + "/" + f.getDate();

					var maps = "https://maps.google.com/?q="+latitude+","+longitude;

					//console.log(salida);

		            //AGREGANDO A LA BASE DE DATOS
		            var landmark = {
						nombre : nombreLugar,
						detalles : salida,
						latitud : latitude,
						longitud : longitude,
						fecha : date,
						imagen : '/images/'+im,
						audio : maps,
						usuario : req.user.nombre,
						wav : nombreLugar+'.wav'
					};

					var config = require('.././database/config');

					var db = mysql.createConnection(config);

					db.connect();

					db.query('INSERT INTO landmark SET ?', landmark, function(err, rows, fields){
						if(err) throw err;

						db.end();
					});
		            
		            
		        }

		        done();		    
		    }
		}]);		
		
		


		res.render('users/panel', {
				isAuthenticated : req.isAuthenticated(),
				user : req.user,
				message : nombreLugar,
				image : '/images/'+im,
				audiowav : nombreLugar+'.wav'
		});
		

		
  		//END CRAWLER
		
  		
		}, (e) => {
 		 console.log('Error: ', e)
		})

		
		return;
	}

};