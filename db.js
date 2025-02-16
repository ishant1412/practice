const mongoose = require("mongoose");
const  schema = mongoose.Schema;
const object_id= schema.ObjectId;

const user = new schema({
  username:{type:String , unique:true},
  password:String
});

const todo = new schema({
   task:String,
   done:Boolean,
   userid:object_id
})

const usermodel = mongoose.model("users",user);
const todomodel = mongoose.model("todos",todo);

module.exports={
    usermodel:usermodel,
    todomodel:todomodel
}
