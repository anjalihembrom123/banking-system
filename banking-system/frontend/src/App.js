import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [holderName, setHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('');

  const fetchAccounts = async () => {
    try {
      const res = await axios.get('/api/accounts');
      setAccounts(res.data);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/accounts', {
        holderName,
        accountNumber,
        balance: Number(initialDeposit)
      });
      setHolderName('');
      setAccountNumber('');
      setInitialDeposit('');
      fetchAccounts();
    } catch (err) {
      console.error('Error creating account:', err);
    }
  };

  const handleTransaction = async (id, type) => {
    const amountStr = prompt(`Enter amount to ${type}:`);
    if (!amountStr) return;
    const amount = Number(amountStr);
    try {
      await axios.patch(`/api/accounts/${id}/transaction`, { amount, type });
      fetchAccounts();
    } catch (err) {
      alert(err.response?.data?.error || 'Transaction failed');
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <h1>Apex Secure Banking System</h1>

      <form onSubmit={handleCreateAccount} style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexDirection: 'column', background: '#f4f4f4', padding: '20px', borderRadius: '5px' }}>
        <h3>Open New Account</h3>
        <input placeholder="Account Holder Name" value={holderName} onChange={(e) => setHolderName(e.target.value)} required />
        <input placeholder="Account Number (e.g., ACC1001)" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
        <input placeholder="Initial Deposit Amount" type="number" value={initialDeposit} onChange={(e) => setInitialDeposit(e.target.value)} required />
        <button type="submit" style={{ padding: '10px', background: '#0056b3', color: '#fff', border: 'none', cursor: 'pointer' }}>Create Account</button>
      </form>

      <h2>Active Accounts Registry</h2>
      {accounts.map((acc) => (
        <div key={acc._id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>{acc.holderName}</strong> ({acc.accountNumber})<br />
            Balance: <strong>${acc.balance.toFixed(2)}</strong>
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button onClick={() => handleTransaction(acc._id, 'deposit')} style={{ background: '#28a745', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Deposit</button>
            <button onClick={() => handleTransaction(acc._id, 'withdraw')} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Withdraw</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;