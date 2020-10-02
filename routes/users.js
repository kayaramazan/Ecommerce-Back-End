var express = require('express');
var router = express.Router();
const { database } = require('../config/helpers')
/* GET users listing. */
router.get('/', function(req, res, next) {
  

  database.query('select * from users').then(result =>
  {
    if(result.length > 0)
    {
      res.status(200).json({
        count : result.length,
        users : result
      })
    }
    else
    res.json({message:'No user founds'})
  }
    ).catch(err =>console.log(err))
});

module.exports = router;
