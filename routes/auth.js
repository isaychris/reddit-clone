const express = require("express");
const router = express.Router();

let Account = require("../models/account");

router.get('/login', function (req, res) {});

router.post('/login', function (req, res) {});

router.get('/register', function (req, res) {});

router.post('/register', function (req, res) {});

router.get('/logout', function (req, res) {});

module.exports = router;