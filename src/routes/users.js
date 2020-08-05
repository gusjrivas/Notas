const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/users/signin',(req,res)=>{
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect:'/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}) )

router.get('/users/signup',(req,res)=>{
    res.render('users/signup');
});

router.post('/users/signup', async (req,res)=>{
   const {name, email, password, confirm_password} = req.body;
   const errors = [];
   if(name.lenght<=0){
       errors.push({text:'Please insert a Name'})
   }
   if(password!=confirm_password){
       errors.push({text:'Password do not match'})
   }
   if(password.lenght > 4){
       errors.push({text:'Password must be a least 4 characters'})
   }
   if(errors.length>0){
       res.render('users/signup', {errors, name, email,password,confirm_password});
   }else{
       const emailUser = await User.findOne({enail: email});
       if(emailUser){
           req.flash('error_msg','The Email is already in use');
           res.redirect('/users/signup');
       }
       const newUser = new User({name,email, password});
       newUser.password=await newUser.encryptPassword(password);
       await  newUser.save();
       req.flash('success_msg','You are registered');
       res.redirect('/users/signin');


    res.send('ok');
   }
});

router.get('/users/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
    

});

module.exports = router;