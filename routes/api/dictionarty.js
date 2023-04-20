const express = require('express');
const router = express.Router();
const { list } = require('../../controllers/dictionarty');

router.post('/list', list);

module.exports = router;
