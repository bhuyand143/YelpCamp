const express=require('express');
const passport = require('passport');
const { isLoggedIn } = require('../middleware');
const router=express.Router();
const User=require('../models/user');
const catchAsync=require('../utils/catchAsync');
const usersControls=require('../controllers/users');

router.route('/register')
    .get(usersControls.renderRegister)
    .post(catchAsync(usersControls.register))

router.route('/login')
    .get(usersControls.renderLogin)
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login',keepSessionInfo:true}),catchAsync(usersControls.login))

router.get('/logout',usersControls.logout);

module.exports=router;