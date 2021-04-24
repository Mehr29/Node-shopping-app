// const {Sequelize} = require('sequelize');

// const sequelize = new Sequelize('node-learning', 'Archer', 'pwdpwd', {
//   dialect: 'mysql',
//   host: 'localhost'
// });

// module.exports = sequelize;

const mongodb=require('mongodb')
const MongoClient=mongodb.MongoClient
let _db;
const mongoConnect =(cb)=>{
  MongoClient.connect(process.env.MONGO_DB).then(
    result=>{
    console.log("Connected!")
    _db=result.db()
    cb()}
  ).catch(err=>{
    console.log(err)
  })
}
const getDb=()=>{
  if(_db){
    return _db
  }
  throw "No database found"
}
exports.getDb=getDb
exports.mongoConnect=mongoConnect