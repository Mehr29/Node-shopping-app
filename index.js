const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose')
const session=require('express-session')
const MongoDBStore=require('connect-mongodb-session')(session)
const csrf=require('csurf')
const flash=require('connect-flash')
const multer = require('multer')
const MONGODB_URI='mongodb+srv://Archer:pwdpwd@cluster0.ntvka.mongodb.net/shop'

const store= new MongoDBStore({
  uri:MONGODB_URI,
  collection:'session',

})
const errorController = require('./controllers/error');

// const sequelize = require('./util/database');
// const Product = require('./models/product');
 const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');


const app = express();
const csrfProtection=csrf()
app.set('view engine', 'ejs');
app.set('views', 'views');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const filename= 'hi'+'-'+file.originalname
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth')
app.use(bodyParser.urlencoded({ extended: false }));

const upload =  multer({storage:fileStorage,fileFilter:fileFilter}).single('image')

app.use((req,res,nxt)=>{
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err,'----12')
    } else if (err) {
      console.log(err,'----45')
      // An unknown error occurred when uploading.
    }
    nxt()
    // Everything went fine.
  })

 

})
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));
app.use(session({ secret: 'heheheBhaiyaFumlStalkbaazi', resave: false, saveUninitialized: false, store: store }))

app.use(csrfProtection) 
app.use(flash())

app.use((req,res,next)=>{
  res.locals.isAuthenticated=req.session.isLoggedIn
  res.locals.csrfToken=req.csrfToken()
  next()
 })

app.use((req, res, next) => {
  if(!req.session.user)
  return next()
  
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user
      next();
    })
    .catch(err => {
      next(new Error(err))
    });
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)

app.use('/500',errorController.get500)
app.use(errorController.get404);
// Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem });

// sequelize
//   // .sync({ force: true })
//   .sync()
//   .then(result => {
//     return User.findByPk(1);
//     // console.log(result);
//   })
//   .then(user => {
//     if (!user) {
//       return User.create({ name: 'Max', email: 'test@test.com' });
//     }
//     return user;
//   })
//   .then(user => {
//     // console.log(user);
//     return user.createCart();
//   })
//   .then(cart => {
//     app.listen(3000);
//   })
//   .catch(err => {
//     console.log(err);
//   });

app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render(...);
  res.redirect('/500');
});
mongoose.connect(
  MONGODB_URI
).then(res=>{
  // User.findOne().then(user=>{
  //   if(!user){
  //     const usr= new User({
  //       name:'Max',email:'Max@max.com',cart:{items:[]}
  //     })
  //     usr.save()
  //   }
  // })
  console.log('Connected!')
  app.listen(3000)
}).catch(err=>{
  console.log('Error!')
  throw new Error(err)

})