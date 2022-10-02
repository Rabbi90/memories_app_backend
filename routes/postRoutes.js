const express = require("express");
const router = express.Router();
const Auth = require("../middleware/Auth");
const {
    GetPosts,
    CreatePost,
    DeletePost,
    UpdatePost,
    GetSingle,
    LikePost,
    GetSearch,
    comments
} = require("../controller/post.controller");

router.get("/posts", GetPosts);
router.post("/post", Auth, CreatePost);
router.get("/post/:id", GetSingle);
router.get("/search", GetSearch);
router.delete("/post/:id", Auth, DeletePost);
router.patch("/post/:id", Auth, UpdatePost);
router.patch("/post/like/:id", Auth, LikePost);
router.post("/post/comment/:id", Auth, comments);

module.exports = router;