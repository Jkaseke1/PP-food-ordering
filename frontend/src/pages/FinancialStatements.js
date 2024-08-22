import React, { useState } from 'react';
import axios from 'axios';

const FinancialStatements = () => {
  const [userId, setUserId] = useState('');
  const [period, setPeriod] = useState('');
  const [statements, setStatements] = useState({});

  const fetchStatements = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/financial-statements/${userId}/${period}`);
      setStatements(data);
    } catch (error) {
      console.error('Failed to fetch statements:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Financial Statements</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-lg font-semibold mb-2">User ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold mb-2">Period</label>
          <input
            type="text"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            placeholder="Period (weekly/monthly)"
            className="w-full p-2 border rounded"
          />
        </div>
        <button onClick={fetchStatements} className="bg-blue-500 text-white px-4 py-2 rounded">Fetch Statements</button>
      </div>
      <pre className="mt-4 bg-gray-100 p-4 rounded">{JSON.stringify(statements, null, 2)}</pre>
    </div>
  );
};

export default FinancialStatements;