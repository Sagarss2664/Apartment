import React, { useState } from 'react';
import styles from '../../CSS/MarkBillAsPaid.module.css';

const MarkBillAsPaid = () => {
  const [flatNumber, setFlatNumber] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [billStatus, setBillStatus] = useState('Paid');
  const [message, setMessage] = useState('');
  const [billDetails, setBillDetails] = useState([]);

  const handleFlatNumberChange = (e) => setFlatNumber(e.target.value);
  const handleUtrNumberChange = (e) => setUtrNumber(e.target.value);
  const handleBillStatusChange = (e) => setBillStatus(e.target.value);

  const markBillAsPaid = async () => {
    if (!/^[A-J](10|[1-9])$/.test(flatNumber)) {
      alert(`Flat number "${flatNumber}" is invalid. Please enter a valid flat number in the format A1, A10, B5, etc.`);
      return;
    }

    if (!/^\d{12}$/.test(utrNumber)) {
      alert('UTR number must be a 12-digit numeric value.');
      return;
    }

    const response = await fetch('https://apartmentmanagementsystem-backend.onrender.com/markBillAsPaid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flat_number: flatNumber, utr_number: utrNumber }),
    });

    const result = await response.json();
    setMessage(result.message || 'An error occurred!');
  };

  const viewBillLogs = async () => {
    const response = await fetch(`https://apartmentmanagementsystem-backend.onrender.com/getBillLogs/${billStatus}`);
    const result = await response.json();

    if (result.success) {
      setBillDetails(result.bills);
    } else {
      setBillDetails([]);
      setMessage(result.message || 'No bill logs found.');
    }
  };

  return (
    <div className="bill-container-updated">
      <h3 className="bill-title-updated">Pay Maintenance Bill</h3>
      <label htmlFor="flat_number" className="bill-label-updated">Flat Number:</label>
      <input
        type="text"
        id="flat_number"
        value={flatNumber}
        onChange={handleFlatNumberChange}
        placeholder="Enter flat number"
        className="bill-input-updated"
      />

      <label htmlFor="utr_number" className="bill-label-updated">UTR Number:</label>
      <input
        type="text"
        id="utr_number"
        value={utrNumber}
        onChange={handleUtrNumberChange}
        placeholder="Enter UTR number"
        className="bill-input-updated"
      />

      <button onClick={markBillAsPaid} className="bill-button-updated">Submit</button>
      <div className="bill-message-updated">{message}</div>

      <div className="bill-divider-updated"></div>

      <h3 className="bill-title-updated">View Bill Logs</h3>
      <label htmlFor="bill_status" className="bill-label-updated">Select Bill Status:</label>
      <select id="bill_status" value={billStatus} onChange={handleBillStatusChange} className="bill-select-updated">
        <option value="Paid">Paid</option>
        <option value="Unpaid">Unpaid</option>
      </select>

      <button onClick={viewBillLogs} className="bill-button-updated">View Bill Logs</button>
      <div className="bill-details-updated">
        {billDetails.length > 0 ? (
          billDetails.map((bill, index) => (
            <div key={index} className="bill-log-updated">
              <p><strong>Flat Number:</strong> {bill.flat_number}</p>
              <p><strong>Status:</strong> {bill.status}</p>
              <p><strong>Date:</strong> {bill.date}</p>
              <p><strong>UTR Number:</strong> {bill.utr_number}</p>
            </div>
          ))
        ) : (
          <p>{message}</p>
        )}
      </div>
    </div>
  );
};

export default MarkBillAsPaid;
