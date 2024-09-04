const Menu = require('../models/Menu');

exports.getMenus = async (req, res) => {
  const menus = await Menu.find();
  res.json(menus);
};

exports.createMenu = async (req, res) => {
  const { caterer, items } = req.body;
  const menu = new Menu({ caterer, items });
  await menu.save();
  res.status(201).json(menu);
};