const express = require("express");
const {
  Chats,
  groupsChats,
  singleChats,
  allUsers,
  searchUsers,
  removeFromGroup,
  renameGroup,
  createGroupChat,
  fetchChats,
  accessChat,
  addToGroup,
} = require("../controllers/chat.controller");
const {
  sendMessage,
  allMessages,
} = require("../controllers/chat.message.controller");
const verifyJWT = require("../middlewares/auth.middleware");
const router = express.Router();

router.route("/").post(verifyJWT, accessChat);
router.route("/").get(verifyJWT, fetchChats);
router.route("/searchUsers").get(verifyJWT, searchUsers);
router.route("/group").post(verifyJWT, createGroupChat);
router.route("/rename").put(verifyJWT, renameGroup);
router.route("/groupremove").put(verifyJWT, removeFromGroup);
router.route("/groupadd").put(verifyJWT, addToGroup);

////message routes
router.route("/message").post(verifyJWT, sendMessage);
router.route("/message/:chatId").get(verifyJWT, allMessages);

module.exports = router;
