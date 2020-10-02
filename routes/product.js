const express = require('express');
const router = express.Router();
const { database } = require('../config/helpers')

/* GET home page. */
router.get('/', function(req, res, next) { 
  console.log('Limit ', req.query.limit)
  console.log('page ', req.query.page)
  let page = (req.query.page != undefined && req.query.page != 0 ) ?  req.query.page : 1;
  const limit = (req.query.limit != undefined && req.query.limit != 0) ? req.query.limit : 10;
  
  let startValue, endValue;
  if(page>0)
  { 
    startValue = (page*limit)-limit
    endValue = page * limit
  }
  else
  {
    startValue = 0;
    endValue = 10;
  }

  database.table('products as p')
  .join([
    {
      table:'categories as c',
      on:'c.id = p.cat_id'
    }
  ]).withFields([
    'c.title as category',
    'p.title as name',
    'p.price',
    'p.quantity',
    'p.image',
    'p.id'
  ])
  .slice(startValue,endValue)
  .sort({id:.1})
  .getAll()
  .then(prods =>{
    if(prods.length > 0)
    {
      res.status(200).json(
        {
          count:prods.length,
          products:prods
        }
        
      )
    }else
    res.json({ message:'No products found' });
  }).catch(err => console.log(err))
});

// GET SINGLE PRODUCT

router.get('/:prodId',function(req,res){
  console.log(req.param) 
  let prodId = req.params.prodId
  database.query('select * from products where id='+prodId+'' ).then(result=>{
    if(result.length > 0)
    {
      res.status(200).json({
        product:result[0]
      })
    }
    else{
      res.json({ message:'No found'})
    }
  }).catch(err => console.log(err))
   
})
module.exports = router;
 