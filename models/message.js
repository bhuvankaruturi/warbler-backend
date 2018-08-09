const mongoose = require('mongoose');
const User = require('./user');

let messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        maxLength: 200
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true});

messageSchema.pre('remove', async function(next){
    try {
        //find the user
        let user = await User.findById(this.user);
        //remove the message from messages list
        user.messages.remove(this.id);
        //save the user
        await user.save();
        //return next
        return next();
    } catch (err) {
        return next(err);
    }
});

let Message = mongoose.model('Message', messageSchema);
module.exports = Message;