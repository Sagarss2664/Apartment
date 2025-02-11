import React, { useState, useEffect } from 'react';
import styles from "../../CSS/EmployeeLogs.module.css";
 // Ensure the file exists and the path is correct

const EmployeeLogs = () => {
  const [employees, setEmployees] = useState([]);
  const [logs, setLogs] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [logDate, setLogDate] = useState('');
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    loadEmployees();
    setLogDate(new Date().toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    handleFilterChange();
  }, [employeeId, logDate]);

  const loadEmployees = async () => {
    try {
      const response = await fetch('https://apartmentmanagementsystem-backend.onrender.com/api/employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const validateDate = () => {
    const selectedDate = new Date(logDate);
    const today = new Date();
    const minDate = new Date('2024-10-01');

    if (selectedDate < minDate) {
      alert('Error: The date should be after October 2024.');
      setLogDate(today.toISOString().split('T')[0]);
      return false;
    }

    if (selectedDate > today) {
      alert('Error: The selected date cannot be in the future.');
      setLogDate(today.toISOString().split('T')[0]);
      return false;
    }

    return true;
  };

  const formatDateTime = (dateString) => {
    return dateString ? new Date(dateString).toLocaleString() : '-';
  };

  const calculateHours = (checkIn, checkOut) => {
    return checkIn && checkOut ? (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60) : 0;
  };

  const handleFilterChange = async () => {
    if (!validateDate()) return;

    let url = 'http://localhost:3000/api/logs';

    if (employeeId) {
      url += `/employee/${employeeId}`;
    } else if (logDate) {
      url += `/date/${logDate}`;
    }

    try {
      const response = await fetch(url);
      const logs = await response.json();
      setLogs(logs);

      const total = logs.reduce((acc, log) => acc + calculateHours(log.CheckInTime, log.CheckOutTime), 0);
      setTotalHours(total.toFixed(2));
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  return (
    <div className="employeeLogsContainer">
      <h1>Employee Attendance Dashboard</h1>

      <div className="employeeLogsFilters">
        <div className="employeeLogsFilterGroup">
          <label htmlFor="employeeSelect">Select Employee:</label>
          <select id="employeeSelect" onChange={(e) => setEmployeeId(e.target.value)}>
            <option value="">All Employees</option>
            {employees.map(emp => (
              <option key={emp.EmployeeID} value={emp.EmployeeID}>
                {emp.Name}
              </option>
            ))}
          </select>
        </div>
        <div className="employeeLogsFilterGroup">
          <label htmlFor="logDate">Select Date:</label>
          <input type="date" id="logDate" value={logDate} onChange={(e) => setLogDate(e.target.value)} />
        </div>
      </div>

      <div id="tableContainer">
        {logs.length === 0 ? (
          <p>No records found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee Name</th>
                <th>Category</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours Worked</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id}>
                  <td>{log.Date}</td>
                  <td>{log.employee.Name}</td>
                  <td>{log.employee.Category}</td>
                  <td>{formatDateTime(log.CheckInTime)}</td>
                  <td>{formatDateTime(log.CheckOutTime)}</td>
                  <td>{calculateHours(log.CheckInTime, log.CheckOutTime).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="employeeLogsTotalHours">
        Total Hours: {totalHours}
      </div>
    </div>
  );
};

export default EmployeeLogs;
