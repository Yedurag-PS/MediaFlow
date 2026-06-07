const auth = require("../middleware/auth");
const Chat = require("../models/chats");
const Message = require("../models/messages");

const router = require("express").Router();

router.get("/", auth, async (req, res) => {
  const userId = req.user._id;

  const chats = await Chat.find({ participants: userId })
    .populate("participants", "_id username")
    .populate({
      path: "lastMessage",
      select: "sender content createdAt",
      populate: {
        path: "sender",
        select: "username",
      },
    })
    .sort({ updatedAt: -1 });

  res.json({ chats });
});

router.get("/:chatId", auth, async (req, res) => {
  const { chatId } = req.params;

  let { page, limit } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  const messages = (
    await Message.find({ chatId }).populate("sender", "_id username")
  )
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const hasPreviousMessages = messages.length === limit ? true : false;

  res.json({ messages, hasPreviousMessages, page, limit });
});

router.post("/createChat", auth, async (req, res) => {
  const userId = req.user._id;
  const recieverId = req.body.recieverId;
  if (!recieverId)
    return res.status(400).json({ message: "Reciever required!" });

  let chat = await Chat.findOne({
    participants: { $all: [userId, recieverId], $size: 2 },
  });

  if (!chat) {
    chat = new Chat({
      participants: [userId, recieverId],
    });
    await chat.save();
  }
  res.status(201).json(chat);
});

router.post("/sendMessages", auth, async (req, res) => {
  const userId = req.user._id;
  const { content, chatId } = req.body;

  if (!content)
    return res
      .status(400)
      .json({ message: "Content(Message/text) is required!" });

  const chat = await Chat.findById(chatId);
  if (!chat || !chat.participants.includes(userId)) {
    return res.status(403).json({ message: "Access Denied!" });
  }

  const newMessage = new Message({
    chatId: chat._id,
    sender: userId,
    content,
  });
  await newMessage.save();

  chat.lastMessage = newMessage._id;
  await chat.save();

  const populateMessage = await Message.findById(newMessage._id).populate(
    "sender",
    "_id username",
  );
  res.json({ newMessage: populateMessage });
});

router.post("/createGroup", auth, async (req, res) => {
  const userId = req.user._id;
  const { participants, groupName } = req.body;
  if (!participants)
    return res.status(400).json({ message: "Participants are required!" });

  const chat = new Chat({
    participants: [...participants, userId],
    groupName: groupName,
    isGroup: true,
    admins: userId,
  });
  await chat.save();

  res.status(201).json(chat);
});

module.exports = router;
