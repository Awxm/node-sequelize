const express = require('express');
const router = express.Router();
const { create, findAll, delete: destroy } = require('../../controllers/cloud_file');

router.post('/create', create);

router.post('/delete', destroy);

router.post('/list', findAll);

module.exports = router;
