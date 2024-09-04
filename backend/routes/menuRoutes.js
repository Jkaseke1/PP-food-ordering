const express = require('express');
const { getMenus, createMenu } = require('../controllers/menuController');
const router = express.Router();

router.get('/', getMenus);
router.post('/', createMenu);

module.exports = router;