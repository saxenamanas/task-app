const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    name:{
        required: true,
        type: String,
        trim: true,
    },

    email:{
        type:String,
        unique: true,
        trim:true,
        required:true,
        lowercase:true,
        validate(text){
            if(!validator.isEmail(text)){
                throw new Error('Please enter a valid email');
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim:true,
        validate(text){
            if(text.toLowerCase().includes('password')){
                throw Error('Password cannot have string password');
            }
        }
    },
    age:{
        type:Number,
        default: 0,
        trim:true,
        validate(value){
            if(value<0){
                throw Error('Age cannot be negative');
            }
        }
    }
});

userSchema.methods.generateAuthToken = async function(){
    try{
        const user = this;
        const token = jwt.sign({ _id: user._id.toString() },'this');
        console.log(token);
        return token;
    }catch(e){
        throw new Error(e);
    }
}

userSchema.statics.findByCredentials = async(email,password)=>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error('No such user found!');
    }

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new Error('Failed to authenticate!');
    }
    return user;
}

userSchema.pre('save',async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    }
    next();
});

const User = mongoose.model('User',userSchema);

module.exports = User;