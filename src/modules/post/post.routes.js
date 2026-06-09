const express = require("express");
const auth = require("../../middleware/auth");
const postUpload = require("../../config/multer-upload");

const router = express.Router();
const postController = require("./post.controller");

router.post(
  "/",
  auth,
  postUpload.array("media", 10),
  postController.createPost,
);
router.get("/myposts", auth, postController.getMyPost);
router.get("/following", auth, postController.getFollowingPosts);
router.delete("/:postId", auth, postController.deletePost);
router.patch("/:postId/like", auth, postController.likeUnlikePost);
router.post("/:postId/comments", auth, postController.addComment);
router.post(
  "/:postId/comments/:commentId/replies",
  auth,
  postController.addCommentReply,
);
router.delete(
  "/:postId/comments/:commentId",
  auth,
  postController.deleteComment,
);

module.exports = router;
