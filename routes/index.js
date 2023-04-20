const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.sendRender('index', { title: 'Expressnccesgug ' });
});

router.get('favicon.ico', (req, res) => res.status(204));

module.exports = router;
