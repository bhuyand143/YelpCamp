const express=require('express');
const app= express();
const path=require('path');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const methodOverride=require('method-override');
const session=require('express-session');
const flash=require('connect-flash');
const ExpressError=require("./utils/ExpressError");
const campgrounds=require('./routes/campground');
const reviews=require('./routes/review');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(()=>{
    console.log('Mongo Connection Open!')
})
.catch(err=>{
    console.log('Oh no Mongo Connection Error!')
    console.log(err)
})

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

const sessionConfig={
    secret:'Shouldbesecureindeploying',
    resave: false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use((req,res,next)=>{
   res.locals.success= req.flash('success');
   res.locals.error=req.flash('error');
   next();
})
// const validateCampground=(req,res,next)=>{
//     const {error}=campgroundSchema.validate(req.body);
//     if(error){
//         const msg=error.details.map(el=>el.message).join(',')
//         throw new ExpressError(msg,400);
//     }else{
//         next();
//     }
// }

// const validateReview=(req,res,next)=>{
//     const {error}=reviewSchema.validate(req.body);
//     if(error){
//         const msg=error.details.map(el=>el.message).join(',')
//         throw new ExpressError(msg,400);
//     }else{
//         next();
//     }
// }

app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);

app.get('/',(req,res)=>{
    res.render('home');
})




app.all("*",(req,res,next)=>{   // if anything does not matches then it come here 
    next(new ExpressError('Page Not found!',404));
})

app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message){
        err.message="Something went wrong!"
    }
    res.status(statusCode).render('error',{err});
})

app.listen(3000, ()=>{
    console.log('Serving on port 3000!');
})