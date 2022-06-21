const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const auth = require('../middleware/auth')
const fs = require('fs')

//create a post

router.post("/", auth, async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a post

router.put("/:id",auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
  
    if (post.userId === req.body.userId || req.body.isAdmin ) {
      
      await post.updateOne({ $set: {desc: req.body.desc} });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }  
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete a post

router.delete("/:id",auth, async ( req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log(post.userId, req.body.userId)
    if (post.userId === req.body.userId || req.body.isAdmin) {
      await post.deleteOne();
      return res.status(200).json("the post has been deleted");
    } else if (!req.body.userId) {
      return res.status(409).json("user missing")
    } else {
      return res.status(403).json("you can delete only your post");
    } 
  } catch (err) {
    return res.status(500).json(err);
  }
});
//like / dislike a post

router.put("/:id/like",auth,  async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) { // permet d'identifier s'il le tableau contient une valeur ou non si oui renvoie true sinon false
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//get a post

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all the posts

router.get("/",auth,  async (req, res) => {
  try {
    
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});


//get user's all posts

router.get("/profile/:username", auth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;
