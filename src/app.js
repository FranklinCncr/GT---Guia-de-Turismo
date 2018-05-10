const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
'use strict'
const vision = require('node-cloud-vision-api')


//Settings
app.set('port', process.env.PORT || 3000);

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());

//routes
require('./routes/userRoutes')(app);

app.listen(app.get('port'),()=>{
  console.log('server on port 3000');
});



// autentificacion
vision.init({auth: 'AIzaSyC9eUegNGqOhI8XaKZLTeKSEW3vQty-MKk'})

// parametros
const req = new vision.Request({
  image: new vision.Image({
    url: 'http://oi49.tinypic.com/23j6a2c.jpg'
  }),
  features: [
    new vision.Feature('FACE_DETECTION', 1),
    new vision.Feature('LABEL_DETECTION', 10),
  ]
})

// peticion
vision.annotate(req).then((res) => {
  // respuesta
  console.log(JSON.stringify(res.responses))
}, (e) => {
  console.log('Error: ', e)
})
