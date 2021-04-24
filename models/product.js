const mongoose=require('mongoose')


const Schema=mongoose.Schema;

const productSchema= new Schema({
  title:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  imageUrl:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  userId:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
  }
  
})

module.exports=mongoose.model('Product',productSchema)


// const mongodb=require('mongodb')

// const getDb = require('../util/database').getDb;

// class Product{
// constructor(title,price,description,imageUrl,id,userId) {
// this.title=title
// this.price=price 
// this.description=description
// this.imageUrl=imageUrl
// this._id=id
// this.userId=userId
// }
// save(){
//   const db=getDb()
//  return db.collection('products').insertOne(this).then(res=>{console.log(res)}).catch(err=>{console.log(err)})
// }
// static fetchAll(){
//   const db=getDb()
//   return db.collection('products').find().toArray().then(res=>{
//     console.log(res)
//     return res
//   }).catch(err=>console.log(err))
// }
// static findById(prodId){
//   const db=getDb()
//   return db.collection('products').find({_id:new mongodb.ObjectID(prodId)}).next().then(res=>{
//     console.log(res,'line1')
//   return res}
//     ).catch()
// }
// static delete(id){
//   const db=getDb()
//   return db.collection('products').deleteOne({_id:new mongodb.ObjectID(id)}).then(res=>{console.log(res)}).catch(err=>{console.log(err)}) 
// }
//  edit(){
//   const db=getDb()
//   return db.collection('products').updateOne({_id:this._id},{$set:this}).then(res=>{console.log(res)}).catch(err=>{console.log(err)}) 
// }
// }
// module.exports = Product;
