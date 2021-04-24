const fs = require('fs')
const path=require('path')
const Product = require('../models/product');
const Order=require('../models/order');
const PDFDocument=require('pdfkit')

const ITEMS_PER_PAGE=2

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
        .then(users => {
          // console.log(users.cart.items)
          const products=users.cart.items
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
          });
        })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId).then(res=>{
    return req.user.addToCart(res)
  })
  .then(res1=>{
    res.redirect('/cart');
  })
  .catch(err=>{
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  })
  // let fetchedCart;
  // let newQuantity = 1;
  // req.user
  //   .getCart()
  //   .then(cart => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then(products => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }

  //     if (product) {
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return product;
  //     }
  //     return Product.findByPk(prodId);
  //   })
  //   .then(product => {
  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity }
  //     });
  //   })
  //   .then(() => {
  //     res.redirect('/cart');
  //   })
  //   .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteProductFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  
  let fetchedCart;
  req.user
  .populate('cart.items.productId')
  .execPopulate()
  .then(users => {
        // console.log(users.cart)
        fetchedCart=users.cart
        const order= new Order({order:fetchedCart,userId:req.user})
        return order.save()
      })
  .then(res=>{
    
    const user=req.user
    user.cart.items=[]
    user.prevOrder.push({orderId:res._id})
    return user.save()
  })
  .then((resu)=>{
    
        res.redirect('/orders')
      })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });

  // req.user
  //   .getCart()
  //   .then(cart => {
  //     fetchedCart = cart;
  //     return cart.getProducts();
  //   })
  //   .then(products => {
  //     return req.user
  //       .createOrder()
  //       .then(order => {
  //         return order.addProducts(
  //           products.map(product => {
  //             product.orderItem = { quantity: product.cartItem.quantity };
  //             return product;
  //           })
  //         );
  //       })
  //       .catch(err => console.log(err));
  //   })
  //   .then(result => {
  //     return fetchedCart.setProducts(null);
  //   })
  //   .then(result => {
  //     res.redirect('/orders');
  //   })
  //   .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user.populate('prevOrder.orderId')
    .execPopulate()
    .then(user => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: user.prevOrder
      });
    })
    .catch(err => next(err));
};

exports.getInvoice = (req,res,next)=>{
const orderId=req.params.orderId

Order.findById(orderId).then(order=>{
 
    if(!order)
    return next(new Error('No order found!'))
    
   if(order.userId.toString()!==req.user._id.toString()){     
     return next(new Error('Unauthorized'))
    }
   
   const invoicePath=path.join('data','invoice','invoice-'+orderId+'.pdf')
   const pdfDoc=new PDFDocument()
   res.setHeader('Content-Type','application/pdf')
   res.setHeader('Content-Disposition','inline;filename="reciept.pdf"')
  
   pdfDoc.pipe(fs.createWriteStream(invoicePath))
   pdfDoc.pipe(res)
   pdfDoc.text('Hello World!!')
   pdfDoc.end()  
   
  //  fs.readFile(invoicePath,(err,data)=>{
  //    if(err)
  //    next(err)
  //    res.setHeader('Content-Type','application/pdf')
  //    res.setHeader('Content-Disposition','attachment;filename="reciept.pdf"')
  //    res.send(data)
  //  })
  
    // const file=fs.createReadStream(invoicePath)
    
    // file.pipe(res) 
}
  

).catch(err=>{
console.log(err)
  next(err)
})


}