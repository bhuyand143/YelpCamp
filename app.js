if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const express=require('express');
const app= express();
const path=require('path');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const methodOverride=require('method-override');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStatergy=require('passport-local');
const mongoSanitize= require('express-mongo-sanitize');
const MongoDBStore=require("connect-mongo")(session);

const User=require('./models/user');
const ExpressError=require("./utils/ExpressError");


const campgroundRoutes=require('./routes/campground');
const reviewRoutes=require('./routes/review');
const userRoutes=require('./routes/users');


mongoose.set('strictQuery', false);

const localUrl='mongodb://127.0.0.1:27017/yelp-camp'
// const dbUrl=process.env.DB_URL
mongoose.connect(localUrl)
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
app.use(mongoSanitize({
    replaceWith:'_'
}));

const store= new MongoDBStore({
    url: localUrl,
    secret:'Shouldbesecureindeploying',
    touchAfter:24*60*60
})

store.on("error",(e)=>{
    console.log("Session store error",e);
})

const sessionConfig={
    store,
    name:'session',
    secret:'Shouldbesecureindeploying', //shuold be changed
    resave: false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStatergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
   res.locals.currentUser=req.user;
   res.locals.success= req.flash('success');
   res.locals.error=req.flash('error');
   next();
})


app.use('/',userRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);

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