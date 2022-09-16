const {
  addMessage,
  getMessages,
} = require("../controllers/messagesController");

const router = require("express").Router();

router.post("/addmsg", addMessage);
router.get("/getmsg", getMessages);

module.exports = router;
