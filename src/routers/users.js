const express = require('express');
const router = new express.Router();
const User = require('../models/user');

router.get('/users',async (req,res)=>{
    try{
        const user = new User(req.body);
        await user.save();
        console.log('Creating...')
        res.status(201).send(user);
    }catch(e){
        res.status(400).send(e);
    }

});


router.post('/users/login',async(req,res)=>{
    try{
        console.log(req.body.email);
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({user,token});
    }catch(e){
        res.status(400).send(e);
    }
});

router.get('/users/:id', async(req,res)=>{

    try{
        const _id = req.params.id;
        const response = await User.findById(_id);
        if(!response){
            return res.status(404).send();
        }
        res.status(200).send(response);

    }catch(e){
        res.status(400).send(e);
    }
});

router.delete('/users/:id',async(req,res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).send('User not found!');
        }
        return res.status(200).send(user)
    }catch(e){
        res.status(400).send(e);
    }
});

router.patch('/users/:id',async(req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','email','password','age'];
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));
    if(!isValidOperation){
        return res.status(400).send('Invalid Fields');
    }
    try{
        const user = await User.findById(req.params.id);
        updates.forEach((update)=>{
            user[update] = req.body[update];
        });
        await user.save();
        if(!user){
            return res.status(400).send('No Such user found');
        }
        res.status(200).send(user);



    }catch(e){
        res.status(401).send(e);
    }

});

module.exports = router;