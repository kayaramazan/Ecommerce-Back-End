var express = require('express');
var router = express.Router();
const { database } = require('../config/helpers')
const app = express() 
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()


/* GET users listing. */
router.get('/', function(req, res, next) {
  database.query('select o.id,p.title, p.description,p.price,u.username from orders o join users u on o.user_id = u.id join orders_details od on od.order_id = o.id join products p on od.product_id=p.id').then(result =>
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


router.get('/:orderId',function(req,res){ 
  let orderId = req.params.orderId
  database.query('select o.id,p.title, p.description,p.price,u.username from orders o join users u on o.user_id = u.id join orders_details od on od.order_id = o.id join products p on od.product_id=p.id  where o.id='+orderId+'' ).then(result=>{
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


router.post('/new',jsonParser,function (req,res) {
   console.log(req.body)
  let {userId, products} = req.body;
  
  if(userId != null && userId > 0 && !isNaN(userId))
  {
    database.table('orders')
    .insert({
      user_id:userId
    })
    .then(newOrderId =>
      {
        if(newOrderId > 0)
        {
          products.forEach(async (p) => {
            let data = await database.table('products').filter({id:p.id}).withFields(['quantity']).get();
            
            let inCart = p.inCart; // item count in cart

            if( data.quantity > 0 )
            {
              data.quantity = data.quantity - inCart;
              if(data.quantity < 0)
                data.quantity = 0;
            }else
            {
              data.quantity = 0; 
            }

            database.table('orders_details')
            .insert({
              order_id:newOrderId,
              product_id:p.id,
              quantity:inCart
            })
            .then(
              newId =>
              {
                database.table('products')
                .filter({id:p.id})
                .update(
                  {
                    quantity:data.quantity
                  })
                  .then(successNum=>{console.log('it works  ')}).catch(err => console.log(err))
              })
            .catch(err => console.log(err))

          });
        }
        else
        {
          res.json({message:'FAILED!! 1',succes:false})
        }
        res.json({
          message:`Order succesfully completed. Order id:${newOrderId}`,
          succes:true,
          order_id:newOrderId,
          products:products
        })

      }).catch(err => console.log(err))
  }
  else
  {
    res.json({message:'FAILED!! 2',succes:false})
  }  
})


router.post('/payment',function (req,res) {
  setTimeout(() => {
    res.status(200).json({success:true})
  }, 3000);
})
module.exports = router;
