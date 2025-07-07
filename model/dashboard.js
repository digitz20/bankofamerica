// model/dashboard.js

const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    balance: {
        type: Number,
        default: 0,
    },
    totalDeposit: {
        type: Number,
        default: 0,
    },
    image: {
        imageUrl: {
            type: String,
        },
        publicId: {
            type: String,
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
}, { timestamps: true });

const dashboardModel = mongoose.model('dashboard', dashboardSchema);

module.exports = dashboardModel;