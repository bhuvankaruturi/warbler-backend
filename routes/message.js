const {createMessage, getMessage, removeMessage} = require("../handlers/message");
const router = require("express").Router({mergeParams: true});

//this route is appended to the default /api/users/:id/messages
router.route("/").post(createMessage);

//this route is appended to the route /api/users/:id/messages/:message_id/
router.route("/:message_id")
        .get(getMessage)
        .delete(removeMessage);

module.exports = router;