var mysql = require('mysql');

module.exports = {

	index : function(req, res, next){

		var landmarks = null;
		var usuario = null;
		var nombre = req.user.nombre;

		var consulta = "SELECT * FROM landmark WHERE usuario = '"+nombre+"'";
		console.log(consulta);

		var consulta2 = "SELECT * FROM users WHERE nombre = '"+nombre+"'";

		var config = require('.././database/config');

		var db = mysql.createConnection(config);

		db.connect();


		db.query(consulta, function(err, rows, fields){
			if(err) throw err;

			landmarks = rows;
			
			db.query(consulta2, function(err, rows, fields){
				if(err) throw err;

				usuario = rows;

				res.render('home', {
					isAuthenticated : req.isAuthenticated(),
					user : req.user,
					usuario : usuario,
					landmarks : landmarks
					
				});
				db.end();
			});		

		});
				
	}
}