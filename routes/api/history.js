const express = require('express');
const router = express.Router();
const { create, findAll, update, delete: destroy } = require('../../controllers/history');

router.post('/create', create);

router.post('/update', update);

router.post('/list', findAll);

router.post('/delete', destroy);

module.exports = router;
