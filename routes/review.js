const express=require('express');
const router=express.Router({mergeParams:true});
const catchAsync=require("../utils/catchAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviewControls=require('../controllers/review');
router.post('/',isLoggedIn,validateReview,catchAsync(reviewControls.createReview));

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviewControls.deleteReview));


module.exports=router;