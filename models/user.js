const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique: true //it is not validation it gives different indexes
    }
});

userSchema.plugin(passportLocalMongoose); //it will add us password and other fields which are required 
module.exports=mongoose.model('User',userSchema);
