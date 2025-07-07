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