const express = require('express');
const router = new express.Router();
const Task = require('../models/task');


router.get('/tasks/:taskid',async (req,res)=>{
    try{
        const _taskid = req.params.taskid;
        const response = await Task.findById(_taskid);
        if(!response){
            return res.status(400).send();
        }
        res.status(200).send(response);

    }catch(e){
        res.status(400).send(e);
    }
});

router.get('/tasks',async(req,res)=>{
    try{
        const task = new Task(req.body);
        await task.save();
        res.status(201).send(task);
    }catch(e){
        res.status(400).send(e);
    }
    
});


router.patch('/tasks/:id',async(req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description','completed'];
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));
    if(!isValidOperation){
        return res.status(400).send('Invalid Fields');
    }
    try{
        const task = await Task.findById(req.params.id);
        updates.forEach((update)=>{
            task[update] = req.body[update];
        });
        await task.save();
        if(!task){
            return res.status(400).send('No Such user found');
        }
        res.status(200).send(task);



    }catch(e){
        res.status(400).send(e);
    }

});



router.delete('/tasks/:id',async(req,res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id);
        if(!task){
            return res.status(404).send('User not found!');
        }
        return res.status(200).send(task)
    }catch(e){
        res.status(400).send(e);
    }
});

module.exports = router;