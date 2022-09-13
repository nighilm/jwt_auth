const express = require('express');
const app1 = express();
const bodyParser = require('body-parser');


const registerRoute = require('./api/routes/registerRoute');
const loginRoute = require('./api/routes/loginRoute');
const tokenRoute = require('./api/routes/tokenRoute');


app1.use(bodyParser.urlencoded({ extended: true }));
app1.use(bodyParser.json());
app1.use(bodyParser.raw());


app1.use((req ,res ,next) => {
    res.header('Access-Control-Allow-Orgin','*');
    res.header('Access-Control-Allow-Headers','Orgin, X-Requested-With , Content-Type , Accept , Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods' , 'PUT, POST ,GET , DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
});


app1.use( '/register' ,registerRoute);
app1.use( '/login' ,loginRoute);
app1.use( '/token' ,tokenRoute);


app1.use((req, res , next) => {
    const error = new Error('Not Found!');
    error.status = 404 ;
    next(error); 
})

app1.use((error , req , res , next ) => {
    res.status(error.status || 500 );
    res.json({
        error:{
            message: error.message
        }
    })
})

module.exports = app1;