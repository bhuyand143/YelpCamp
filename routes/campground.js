const express=require('express');
const router=express.Router();
const catchAsync=require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgroundControls=require('../controllers/campground');
const multer=require('multer');
const {storage} = require('../cloudinary');

const upload=multer({storage});

router.route('/')
    .get(catchAsync(campgroundControls.index))
    .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgroundControls.createCampground))

router.get('/new',isLoggedIn,campgroundControls.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgroundControls.showCampground))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campgroundControls.updateCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(campgroundControls.deleteCampground))

 
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgroundControls.renderEditForm))
 
 module.exports=router;