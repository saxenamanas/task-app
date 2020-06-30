const mongoose = require('mongoose');

const Task = mongoose.model('Task',{
    description:{
        type:String,
        required:true,
        trim:true,
        validator(task){
            if(task==''){
                throw new Error('Task cannot be empty');
            }
        }
    },
    completed:{
        type: Boolean,
        required:false,
        default:false,
        
    }
})

module.exports = Task;