const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    accountNumber: { type: String, required: true, unique: true },
    holderName: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 },
    accountType: { type: String, enum: ['Savings', 'Checking'], default: 'Savings' }
}, { timestamps: true });

module.exports = mongoose.model('Account', AccountSchema);