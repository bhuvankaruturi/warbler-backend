require("dotenv").config();
const app = require("express")();
const bodyParser = require("body-parser");
const cors = require("cors");
const errorHandler = require("./handlers/error");
const authRouter = require("./routes/auth");
const messageRouter = require("./routes/message");
const {loginRequired, ensureCorrectUser} = require("./middleware/auth");
const db = require('./models');
const PORT = 8081;

app.use(bodyParser.json());
app.use(cors());

//All my routes will be setup here
app.use("/api/auth", authRouter);
app.use("/api/users/:id/messages",
        loginRequired,
        ensureCorrectUser,
        messageRouter);
        
//display all the messages in db to the signed in user
app.use("/api/messages",
        loginRequired,
        async function(req, res, next) {
            try {
                let messages = await db.Message.find().sort({createdAt: "desc"}).populate("user", {
                    username: true,
                    profileImageUrl: true
                });
                return res.status(200).json(messages);
            } catch(err){
                return next(err);
            }
        });

//default error handler to handle requests not handled by the app.
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use(errorHandler);

app.listen(PORT, function(){
    console.log(`App is running on port ${PORT}`);
})