import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().sort({ role: 1, name: 1 });
        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get users by role
router.get('/role/:role', async (req, res) => {
    try {
        const users = await User.find({ role: req.params.role }).sort({ name: 1 });
        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get user statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const inventoryManagers = await User.countDocuments({ role: 'Inventory Manager' });
        const warehouseStaff = await User.countDocuments({ role: 'Warehouse Staff' });
        const activeUsers = await User.countDocuments({ isActive: true });

        res.json({
            success: true,
            data: {
                total: totalUsers,
                inventoryManagers,
                warehouseStaff,
                active: activeUsers,
                inactive: totalUsers - activeUsers
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;
