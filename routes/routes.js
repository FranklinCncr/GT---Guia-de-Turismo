var express = require('express');
var router = express.Router();
var passport = require('passport');
var controllers = require('.././controllers');
var AuthMiddleware = require('.././middleware/auth');
const multer = require('multer');

const multerConf = {
	storage : multer.diskStorage({
		destination : function(req,file,next){
			next(null,'./public/images');
		},
		filename : function(req,file,next){
			const ext = file.mimetype.split('/')[1];
			next(null,file.originalname)
		}
	}),
	fileFilter : function(req,file,next){
		if(!file){
			next();
		}
		const image = file.mimetype.startsWith('image/');
		if(image){
			next(null,true);
		}else{
			next({message:"Archivo no soportado"},false);
		}
	}
}

router.get('/', controllers.HomeController.index);

//routas de usuario
router.get('/auth/signup', controllers.UserController.getSignUp);
router.post('/auth/signup', multer(multerConf).single('imagen') ,controllers.UserController.postSignUp);
router.get('/auth/signin', controllers.UserController.getSignIn);
//
router.post('/auth/signin',  passport.authenticate('local', {
	successRedirect : '/users/panel',
	failureRedirect : '/auth/signin',
	failureFlash : true 
}));
router.get('/auth/logout', controllers.UserController.logout);
router.get('/users/panel', AuthMiddleware.isLogged ,controllers.UserController.getUserPanel);
router.post('/users/panel', AuthMiddleware.isLogged , multer(multerConf).single('imagen') ,controllers.UserController.postUserPanel);

module.exports = router;
