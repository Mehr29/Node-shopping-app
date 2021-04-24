const mongoose=require('mongoose')

const Schema=mongoose.Schema

const orderSchema = new Schema({
  order:{
    items:[]
  },
  userId:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
  }
})

module.exports = mongoose.model('Order',orderSchema);
