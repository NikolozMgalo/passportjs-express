const express = require("express")
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const cors = require("cors")
const mongoose = require("mongoose")
const errorHandler = require("errorhandler")


mongoose.promise = global.Promise

const isProduction = process.env.NODE_ENV === 'production'

const app = express();

app.use(cors())
app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({secret : 'passport tutorial', coockie: {maxAge: 6000}, resave: false, saveUninitialized: false }))

if(!isProduction){
    app.use(errorHandler())
}

mongoose.connect('mongodb://user123456:user123456@ds129914.mlab.com:29914/auth', { useNewUrlParser : true })
mongoose.set('debug', true)

require('./model/user.model')
require('./config/passport')
app.use(require('./routes'))


if(!isProduction){
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        console.log(err)

        res.json({
            errors:{
                message: err.message,
                err:err,
            },
        })
    })
}
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    console.log(err)

    res.json({
        errors: {
            message: err.message,
            err: {message: "something went wrong"},
        }
    })
})

app.listen(3000, () => console.log("server is running port is 3000"))