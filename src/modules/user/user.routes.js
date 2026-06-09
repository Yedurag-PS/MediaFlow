const express = require("express");


const auth = require("../../middleware/auth");
const router = express.Router();
const userController = require("./user.controller")

router.post("/", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/", auth, userController.getUser);
router.post("/request-password-reset", userController.requestResetPassword);
router.post("/reset-password", userController.resetPassword);
router.post("/:userId/follow", auth, userController.followUser);
router.post("/reject-request/:requesterId", auth, userController.rejectFollowRequest );
router.post("/accept-request/:requesterId", auth, userController.acceptFollowRequest );
router.get("/:userId/followers", auth, userController.getOtherUserFollowerList);
router.get("/:userId/following", auth, userController.getOtherUserFollowingList );
router.post("/:userId/unfollow", auth, userController.unfollowUser);


module.exports = router;
