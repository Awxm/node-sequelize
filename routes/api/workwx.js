const express = require('express');
const router = express.Router();
const { send } = require('../../controllers/workwx');

router.post('/send', send);

module.exports = router;
