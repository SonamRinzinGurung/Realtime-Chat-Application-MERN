const Messages = require("../models/messageModel");

module.exports.getMessages = async (req, res, next) => {};
module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data) return res.json({ msg: "Message added successfully" });
    return res.json({ msg: "Message not added to database" });
  } catch (error) {
    next(error);
  }
};
