const db = require("../models");

exports.createMessage = async function(req, res, next) {
    try {
       //create a message
       let message = await db.Message.create({
           text: req.body.text,
           user: req.params.id
       });
       let foundUser = await db.User.findById(req.params.id);
       //push the message id into the messages array of the logged in user
       foundUser.messages.push(message.id);
       //save the user
       await foundUser.save();
       let foundMessage = await db.Message.findById(message.id).populate("user", {
           username: true,
           profileImageUrl: true
       });
       return res.status(200).json(foundMessage);
    } 
    catch (err) {
        return next(err);
    }
};

exports.getMessage = async function(req, res, next) {
    try {
        let message = await db.Message.findById(req.params.message_id).populate("user", {
            username: true,
            profileImageUrl: true
        });
        return res.status(200).json(message);
    } catch (e) {
        return next({
            message: 'Message not found',
            status: 400
        });
    }
};

exports.removeMessage = async function(req, res, next) {
    try {
        //cannot use findByIdAndRemove because we want the pre('remove') callback to be executed
        let foundMessage = await db.Message.findById(req.params.message_id);
        //remove the message now
        foundMessage.remove();
        //send the response with the deleted message
        return res.status(200).json(foundMessage);
    } catch (err) {
        return next({
            message: 'Message cannot be deleted. Either the message is already deleted or you are not authorized to perform the action',
            status: 400
        });
    }
};
