const db = require("../models");
const jwt = require("jsonwebtoken");

//handle user signin
exports.signin = async function(req, res, next){
    //get the entered email and find the relevant document from db
    try {
        let user = await db.User.findOne({email: req.body.email});
        let isMatch = user?await user.comparePassword(req.body.password, next):false;
        //if password matches then sign a token and send the response
        if (isMatch) {
            let {id, username, profileImageUrl} = user;
            let token = jwt.sign({
                id,
                username,
                profileImageUrl
            }, 
            process.env.SECRET_KEY);
            return res.status(200).json({
                id,
                username,
                profileImageUrl,
                token
            });
        } 
        // if password does not match send an error message
        else {
            return next({
                message: "The email/password is incorrect",
                status: 400
            });
        }
    } catch(err) {
        return next({
            status: 400,
            message: err.message
        });
    }
};

//handle user signup
exports.signup = async function(req, res, next) {
    try {
        //wait untill the promise is resolved
        let user = await db.User.create(req.body);
        let {id, username, profileImageUrl} = user;
        let token = jwt.sign({
            id,
            username,
            profileImageUrl
        }, 
        process.env.SECRET_KEY);
        return res.status(200).json({
            id,
            username,
            profileImageUrl,
            token
        });
    } catch (err) {
        //if a validation fails!
        if(err.code === 11000) {
            err.message = "The username and/or email have already been taken";
        }
        return next({
            status: 400,
            message: 'Email, username and password are required. Make sure to provide valid email'
        });
    }
};

