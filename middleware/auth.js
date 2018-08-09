require("dotenv").load();
const jwt = require("jsonwebtoken");

//check the users authentication
exports.loginRequired = function(req, res, next) {
    try {
        let token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, function(error, decoded){
            if(decoded) {
                return next();
            } else {
                return next({
                    message: 'Please login first',
                    status: '401'
                });
            }
        });
    } catch (err) {
        return next({
            message: 'Please login first',
            status: 401
        });
    }
};

//check the users authorization
exports.ensureCorrectUser = function(req, res, next) {
    try {
        let token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, function(error, decoded){
            if(decoded && decoded.id === req.params.id) {
                return next();
            } else {
                return next({
                    message: 'Unauthorized action',
                    status: 401
                });
            }
        });
    } catch (err) {
        return next({
            message: 'Unauthorized action',
            status: 401
        });
    }
};

