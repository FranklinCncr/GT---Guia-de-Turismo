/*const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
  res.json([]);
});

module.exports = router;*/

const User = require('../models/userbd')


module.exports = function (app){

  app.get('/users',(req, res)=>{
    User.getUsers((err, data)=>{
      res.status(200).json(data);
    });
  });

  app.post('/users', (req, res)=>{
    const userData = {
      id: null,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      created_at: null,
      update_at: null
    };

    User.insertUser(userData, (err, data) =>{
      if(data && data.insertId){
        res.json({
          success: true,
          msg: 'Usuario Insertado',
          data: data
        })
      }else{
        res.status(500).json({
          success: false,
          msg: 'Error'
        })
      }
    })
  })
}
