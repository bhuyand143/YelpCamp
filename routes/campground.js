const express=require('express');
const router=express.Router();
const catchAsync=require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgroundControls=require('../controllers/campground');

router.get('/',catchAsync(campgroundControls.index));
 
 router.get('/new',isLoggedIn,campgroundControls.renderNewForm);
 
 router.post('/',isLoggedIn,validateCampground,catchAsync(campgroundControls.createCampground))
 
 router.get('/:id',catchAsync(campgroundControls.showCampground))
 
 router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgroundControls.renderEditForm))
 
 router.put('/:id',isLoggedIn,isAuthor,validateCampground,catchAsync(campgroundControls.updateCampground))
 
 router.delete('/:id',isLoggedIn,isAuthor,catchAsync(campgroundControls.deleteCampground))
 
 module.exports=router;