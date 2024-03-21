const express = require('express');
const app = express();
const morgan = require('morgan')
const  tourRouter = require('./routes/tourRoute')
const userRouter = require('./routes/userRoute')
app.use(express.json()); //express.json is middelware

// first middelware
app.use(morgan('dev'))
app.use((req, res, next)=>{
    console.log('hello from the middelware😤');
    next();
});

app.use((req, res, next)=>{
    req.requestTime = new Date().toISOString();
    next();
}); 

// routes
//mounting the router

app.use('/api/v1//tours', tourRouter);
app.use('/api/v1/users', userRouter);
//start server
module.exports= app;