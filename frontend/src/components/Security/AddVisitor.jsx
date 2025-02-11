import React, { useState, useEffect } from 'react';
import styles from '../../CSS/AddVisitor.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddVisitor = () => {
  const [visitors, setVisitors] = useState([]);
  const [visitor, setVisitor] = useState({
    visitor_name: '',
    flat_number: '',
    purpose: ''
  });

  const API_URL = 'https://apartment-v69r.onrender.com/api/visitors';

  const fetchVisitors = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch visitors');
      }
      const data = await response.json();
      setVisitors(data);
    } catch (error) {
      console.error('Error fetching visitors:', error);
    }
  };

  const addVisitor = async (e) => {
    e.preventDefault();
    if (!visitor.visitor_name || !visitor.flat_number || !visitor.purpose) {
      alert('Please fill in all fields');
      return;
    }

    const isValidFlatNumber = validateFlatNumber(visitor.flat_number);
    if (!isValidFlatNumber) {
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...visitor, entry_datetime: new Date().toISOString(), status: 'Active' })
      });

      if (!response.ok) {
        throw new Error('Failed to add visitor');
      }

      setVisitor({ visitor_name: '', flat_number: '', purpose: '' });
      fetchVisitors();
    } catch (error) {
      console.error('Error adding visitor:', error);
      alert('Failed to add visitor');
    }
  };

  const checkOutVisitor = async (id) => {
    try {
      const response = await fetch(`${API_URL}/checkout/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exit_datetime: new Date().toISOString() })
      });
      if (!response.ok) {
        throw new Error('Failed to check out visitor');
      }
      fetchVisitors();
    } catch (error) {
      console.error('Error checking out visitor:', error);
      alert('Failed to check out visitor');
    }
  };

  const validateFlatNumber = (flatNumber) => {
    if (/^-/.test(flatNumber)) {
      alert(`Flat number "${flatNumber}" is invalid. Flat numbers cannot be negative.`);
      return false;
    }

    if (flatNumber === "0") {
      alert(`Flat number "${flatNumber}" is invalid. Flat numbers cannot be zero.`);
      return false;
    }

    if (/^\d+$/.test(flatNumber)) {
      alert(`Flat number "${flatNumber}" is invalid. Flat numbers must start with a letter (A-J).`);
      return false;
    }

    if (!/^[A-J]/.test(flatNumber)) {
      alert(`Flat number "${flatNumber}" is invalid. It must start with a letter (A-J).`);
      return false;
    }

    if (!/^[A-J](10|[1-9])$/.test(flatNumber)) {
      alert(
        `Flat number "${flatNumber}" is invalid. Please enter a valid flat number in the format A1, A10, B5, etc.\n` +
        'Valid flat numbers:\n' +
        '- Start with a letter (A-J).\n' +
        '- Are followed by a number between 1 and 10.\n' +
        'Examples of valid flat numbers: A1, B10, H5.\n' +
        'Invalid examples: B11, J12, S1, K2.'
      );
      return false;
    }

    return true;
  };

  useEffect(() => {
    fetchVisitors();
    const interval = setInterval(fetchVisitors, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVisitor((prevVisitor) => ({
      ...prevVisitor,
      [name]: value
    }));
  };

  return (
    <div className="body">
      <div className="form-container">
        <h3>Add Visitor</h3>
        <form onSubmit={addVisitor}>
          <input
            type="text"
            id="visitor_name"
            name="visitor_name"
            placeholder="Visitor Name"
            value={visitor.visitor_name}
            onChange={handleChange}
            required
            className="form-control"
          />
          <input
            type="text"
            id="flat_number"
            name="flat_number"
            placeholder="Flat Number"
            value={visitor.flat_number}
            onChange={handleChange}
            required
            className="form-control"
          />
          <input
            type="text"
            id="purpose"
            name="purpose"
            placeholder="Purpose of Visit"
            value={visitor.purpose}
            onChange={handleChange}
            required
            className="form-control"
          />
          <button type="submit" className="btn btn-primary">Check In</button>
        </form>
      </div>

      <div className="form-container">
        <h3>Visitor Log</h3>
        <table id="visitorTable" className="table table-striped table-bordered">
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
          <tbody id="visitorTableBody">
            {visitors.map((visitor) => (
              <tr key={visitor._id}>
                <td>{visitor.visitor_name}</td>
                <td>{visitor.flat_number}</td>
                <td>{visitor.purpose}</td>
                <td>{new Date(visitor.entry_datetime).toLocaleString()}</td>
                <td>{visitor.exit_datetime ? new Date(visitor.exit_datetime).toLocaleString() : '-'}</td>
                <td>{visitor.status}</td>
                <td>
                  {visitor.status === 'Active' ? (
                    <button className="checkout-btn btn btn-danger" onClick={() => checkOutVisitor(visitor._id)}>
                      Check Out
                    </button>
                  ) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddVisitor;
