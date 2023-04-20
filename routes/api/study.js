const express = require('express');
const router = express.Router();
const { create, getInfo, findAll, update } = require('../../controllers/study');

router.post('/create', create);

router.post('/update', update);

router.post('/info', getInfo);

router.post('/list', findAll);

module.exports = router;
