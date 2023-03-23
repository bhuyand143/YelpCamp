module.exports=(func)=>{
    return (req,res,next)=>{   //it is try catch wrap up  and it takes input as the function and executes it and if any error occurs it executes the  catch block;
        func(req,res,next).catch(next);
    }
}