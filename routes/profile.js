const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

let Subreddit = require("../models/subreddit");
let Post = require("../models/post");
let Comment = require("../models/comment");
let Profile = require("../models/profile");
let PostState = require("../models/postState")
let CommentState = require("../models/commentState")

router.get('/:user', function (req, res) {});

router.get('/:user/comments', function (req, res) {});

router.get('/:user/posts', function (req, res) {});

router.get('/:user/saved', function (req, res) {});



module.exports = router