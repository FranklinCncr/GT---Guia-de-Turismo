/*const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
  res.json([]);
});

module.exports = router;*/
module.exports = function (app){
  app.get('/',(req,res)=>{
    res.json([]);
  });
}
