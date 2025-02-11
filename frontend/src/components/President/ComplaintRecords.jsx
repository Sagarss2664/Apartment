import React, { useState, useEffect } from 'react';
import styles from '../../CSS/ComplaintRecords.module.css'; // Adjust the path as needed

const ComplaintRecordsUpdated = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaintRecords();
  }, []);

  const fetchComplaintRecords = async () => {
    try {
      const response = await fetch('https://apartment-v69r.onrender.com/api/complaint-records');
      const records = await response.json();
      setComplaints(records);
    } catch (error) {
      console.error('Error fetching complaint records:', error);
    }
  };

  const updateStatus = async (id) => {
    try {
      const response = await fetch(`https://apartment-v69r.onrender.com/api/complaint-records/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        alert('Status updated to Completed');
        fetchComplaintRecords(); // Refresh the list
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  return (
    <div className="complaintRecordsContainerUpdated">
      <h3 className="complaintRecordsHeadingUpdated">All Complaints</h3>
      <table className="complaintRecordsTableUpdated">
        <thead>
          <tr>
            <th className="tableHeaderUpdated">Flat Number</th>
            <th className="tableHeaderUpdated">Complaint Type</th>
            <th className="tableHeaderUpdated">Description</th>
            <th className="tableHeaderUpdated">Status</th>
            <th className="tableHeaderUpdated">Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.length === 0 ? (
            <tr>
              <td colSpan="5" className="noComplaintsUpdated">No complaints found</td>
            </tr>
          ) : (
            complaints.map((record) => (
              <tr key={record._id}>
                <td className="tableDataUpdated">{record.flat_number}</td>
                <td className="tableDataUpdated">{record.complaint}</td>
                <td className="tableDataUpdated">{record.description}</td>
                <td className="tableDataUpdated">{record.status}</td>
                <td className="tableDataUpdated">
                  {record.status === 'pending' ? (
                    <button className="buttonUpdated" onClick={() => updateStatus(record._id)}>Mark as Completed</button>
                  ) : (
                    'Completed'
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintRecordsUpdated;
