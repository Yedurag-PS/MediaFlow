const auth = require("../../middleware/auth");

const router = require("express").Router();
const chatController = require("./chat.controller");

router.get("/", auth, chatController.getChats);
router.get("/:chatId", auth, chatController.getChatMessages);
router.post("/createChat", auth, chatController.createChat);
router.post("/createGroup", auth, chatController.createGroup);

module.exports = router;
