const mongoose= require('mongoose')

const Schema= mongoose.Schema

const userSchema= new Schema({
 
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  refreshToken:String,
  refreshTokenExpiration:Date,
  cart:{
    items:[{
      productId:{type:Schema.Types.ObjectId,ref:'Product',required:true},
      quantity:{type:Number,required:true}
    }]
  },
  prevOrder:[{
    orderId:{type:Schema.Types.ObjectId,ref:'Order'}
  }]
})

userSchema.methods.addToCart= function(product){
 const cartProductIndex=this.cart.items.findIndex(item=>{
   return item.productId.toString()===product._id.toString()
 })
 let newQuantity=1
let updatedCartItems=[...this.cart.items]
if(cartProductIndex>=0){
newQuantity=this.cart.items[cartProductIndex].quantity+1
updatedCartItems[cartProductIndex].quantity=newQuantity
}
else{
  updatedCartItems.push({productId:product._id,quantity:newQuantity})
}
const updatedCart={items:updatedCartItems}
this.cart=updatedCart
return this.save()
}

userSchema.methods.deleteProductFromCart=function(prodId){
  const updatedCart=this.cart.items.filter(product=>{
      return product.productId.toString() !== prodId.toString()
  })
  
  this.cart = updatedCart

  return this.save()

}
module.exports=mongoose.model('User',userSchema)

// const mongodb=require('mongodb')

// const getDb = require('../util/database').getDb;

// class Users{
// constructor(name,email,cart,id) {
// this.name=name
// this.email=email
// this.cart=cart
// this._id=id
// }
// save(){
//   const db=getDb()
//  return db.collection('users').insertOne(this).then(res=>{console.log(res)}).catch(err=>{console.log(err)})
// }
// addToCart(product){
//  const cartProductIndex=this.cart.items.findIndex(item=>{
//    return item.productId.toString()===product._id.toString()
//  })
//  let newQuantity=1
// let updatedCartItems=[...this.cart.items]
// if(cartProductIndex>=0){
// newQuantity=this.cart.items[cartProductIndex].quantity+1
// updatedCartItems[cartProductIndex].quantity=newQuantity
// }
// else{
//   updatedCartItems.push({productId:new mongodb.ObjectID(product._id),quantity:newQuantity})
// }
// const updatedCart={items:updatedCartItems}
// const db=getDb()
//  return db.collection('users').updateOne({_id: new mongodb.ObjectID(this._id)},{$set:{cart:updatedCart}}).then(res=>{console.log(res)}).catch(err=>{console.log(err)})
// }

// getCart(){
//   const db = getDb();
//     const productIds = this.cart.items.map(i => {
//       return i.productId;
//     });
//     return db
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then(products => {
//         return products.map(p => {
//           return {
//             ...p,
//             quantity: this.cart.items.find(i => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity
//           };
//         });
//       });
// }
// static findById(Id){
//   const db=getDb()
//   return db.collection('users').findOne({_id:new mongodb.ObjectID(Id)}).then(res=>{
//     console.log(res,'line1')
//   return res
// }).catch(err=>console.log(err))
// }
// }
// module.exports = Users;
