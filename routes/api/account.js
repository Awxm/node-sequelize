const express = require('express');
const router = express.Router();
const { findAll, create, update, delete: destroy, getInfo, updateStatus } = require('../../controllers/account');
const { login } = require('../../controllers/login');

router.post('/login', login);

router.post('/info', getInfo);

router.post('/create', create);

router.post('/delete', destroy);

router.post('/update', update);

router.post('/update_status', updateStatus);

router.post('/list', findAll);

module.exports = router;
