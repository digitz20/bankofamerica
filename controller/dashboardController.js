const dashboardModel = require('../model/dashboard');
const userModel = require('../model/user');
const sendEmail = require('../middlewares/nodemailer');
const cloudinary = require('cloudinary').v2;



exports.getDashboard = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const dashboard = await dashboardModel.findOne({ user: user._id });
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }
        res.status(200).json({ dashboard });
    } catch (error) {
        console.error('Error fetching dashboard:', error);
        res.status(500).json({ message: 'Error fetching dashboard', error: error.message });
    }
};


exports.createDashboard = async (req, res) => {
    try {
        const { userID, fullName, balance, totalDeposit, image, transactionHistory, deposits } = req.body;
        // Find user by userID
        const user = await userModel.findOne({ userID });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if dashboard already exists
        const existingDashboard = await dashboardModel.findOne({ user: user._id });
        if (existingDashboard) {
            return res.status(400).json({ message: 'Dashboard already exists for this user' });
        }
        const dashboard = new dashboardModel({
            user: user._id,
            fullName: fullName || user.fullName,
            balance: balance || 0,
            totalDeposit: totalDeposit || 0,
            image: image || {},
            transactionHistory: transactionHistory || [],
            deposits: deposits || []
        });
        await dashboard.save();
        res.status(201).json({ message: 'Dashboard created successfully', dashboard });
    } catch (error) {
        console.error('Error creating dashboard:', error);
        res.status(500).json({ message: 'Error creating dashboard', error: error.message });
    }
};