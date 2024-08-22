const Order = require('../models/Order');
const logger = require('../config/logger');

exports.placeOrder = async (req, res) => {
    const { caterer, date, meal, quantity, selectedItems } = req.body;

    // Validate request body
    if (!caterer || !date || !meal || !quantity || !selectedItems || !Array.isArray(selectedItems) || selectedItems.length === 0) {
        logger.warn('Order placement failed: Missing required fields', { caterer, date, meal, quantity, selectedItems });
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate selected items
    const requiredCategories = ['entrees', 'starches'];
    const optionalCategories = ['sides', 'desserts'];
    const selectedCategories = selectedItems.map(item => item.category);

    // Check if required categories are selected
    for (const category of requiredCategories) {
        if (!selectedCategories.includes(category)) {
            logger.warn(`Order placement failed: Missing required category ${category}`, { selectedCategories });
            return res.status(400).json({ message: `You must select one item from ${category}` });
        }
    }

    // Check if only one item per category is selected
    const categoryCounts = selectedCategories.reduce((acc, category) => {
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});

    for (const category of [...requiredCategories, ...optionalCategories]) {
        if (categoryCounts[category] > 1) {
            logger.warn(`Order placement failed: Multiple items selected from category ${category}`, { categoryCounts });
            return res.status(400).json({ message: `You can only select one item from ${category}` });
        }
    }

    try {
        const newOrder = new Order({
            userId: req.user._id, // Use req.user._id for the authenticated user's ID
            caterer,
            date,
            meal,
            quantity,
            selectedItems
        });

        const savedOrder = await newOrder.save();
        logger.info('Order placed successfully', { orderId: savedOrder._id });
        res.status(201).json({ message: 'Order placed successfully!', order: savedOrder });
    } catch (err) {
        logger.error('Error placing order:', { error: err.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};