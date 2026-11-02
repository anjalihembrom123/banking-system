const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Account = require('./models/Account');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/banking_system';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Get all bank accounts
app.get('/api/accounts', async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new bank account
app.post('/api/accounts', async (req, res) => {
  try {
    const newAccount = new Account(req.body);
    const savedAccount = await newAccount.save();
    res.status(201).json(savedAccount);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Deposit or Withdraw funds
app.patch('/api/accounts/:id/transaction', async (req, res) => {
  try {
    const { amount, type } = req.body; // type: 'deposit' or 'withdraw'
    const account = await Account.findById(req.params.id);

    if (!account) return res.status(404).json({ error: 'Account not found' });

    if (type === 'withdraw' && account.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    account.balance = type === 'deposit' ? account.balance + amount : account.balance - amount;
    const updatedAccount = await account.save();
    res.json(updatedAccount);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});