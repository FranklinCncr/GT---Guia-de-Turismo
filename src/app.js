const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

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

/*app.get('/',(req,res)=>{
  res.send('recivido');
});

app.post('/',(req,res)=>{
  res.send('guardando...');
});

app.put('/',(req,res)=>{
  res.send('actualizando...');
});

app.delete('/',(req,res)=>{
  res.send('eliminando...');
});*/
