import React, { useState, useEffect } from 'react';
import styles from '../../CSS/VisitorManagement.module.css'; // Adjust the path as needed

const VisitorManagement = () => {
  const [visitors, setVisitors] = useState([]);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    loadVisitors();
  }, [filterDate]);

  const loadVisitors = async () => {
    try {
      if (filterDate) {
        const selectedDate = new Date(filterDate);
        const today = new Date();
        const oct2024 = new Date('2024-10-01');

        if (selectedDate < oct2024) {
          alert('Error: Date must be after October 2024.');
          return;
        }

        if (selectedDate > today) {
          alert('Error: Date cannot be in the future.');
          return;
        }
      }

      let url = 'https://apartment-v69r.onrender.com/api/visitors';
      if (filterDate) {
        url = `${url}/date/${filterDate}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch visitors');

      const visitors = await response.json();
      setVisitors(visitors);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const clearDateFilter = () => {
    setFilterDate('');
  };

  const checkOut = async (id) => {
    try {
      const response = await fetch(`https://apartment-v69r.onrender.com/api/visitors/checkout/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exit_datetime: new Date().toISOString() }),
      });

      if (!response.ok) throw new Error('Failed to check out visitor');
      await loadVisitors();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to check out visitor');
    }
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className={styles.formContainer}>
      <h3>Visitor Log</h3>
      <div className={styles.dateFilter}>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <button onClick={clearDateFilter}>Clear Filter</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Flat Number</th>
            <th>Purpose</th>
            <th>Check In Time</th>
            <th>Check Out Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {visitors.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>No visitors found</td>
            </tr>
          ) : (
            visitors.map((visitor) => (
              <tr key={visitor._id}>
                <td>{visitor.visitor_name}</td>
                <td>{visitor.flat_number}</td>
                <td>{visitor.purpose}</td>
                <td>{formatDateTime(visitor.entry_datetime)}</td>
                <td>{visitor.exit_datetime ? formatDateTime(visitor.exit_datetime) : '-'}</td>
                <td>{visitor.status}</td>
                <td>
                  {visitor.status === 'Active' ? (
                    <button className={styles.checkoutBtn} onClick={() => checkOut(visitor._id)}>Check Out</button>
                  ) : '-'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VisitorManagement;
