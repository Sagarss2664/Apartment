import React, { useEffect, useState } from 'react';
import styles from '../../CSS/EmployeeAttendance.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const EmployeeAttendance = () => {
  const [employees, setEmployees] = useState([]);

  const updateDateDisplay = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("currentDateDisplay").innerText =
      `Today's Date: ${new Date().toLocaleDateString(undefined, options)}`;
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  };

  const loadEmployees = async () => {
    try {
      const response = await fetch('https://apartmentmanagementsystem-backend.onrender.com/api/employees');
      const employeesData = await response.json();
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const checkIn = async (employeeId) => {
    try {
      const response = await fetch('https://apartmentmanagementsystem-backend.onrender.com/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ EmployeeID: employeeId })
      });

      if (response.ok) {
        loadEmployees();
      } else {
        const data = await response.json();
        alert(data.message || 'Check-in failed');
      }
    } catch (error) {
      console.error('Error during check-in:', error);
      alert('Check-in failed');
    }
  };

  const checkOut = async (employeeId) => {
    try {
      const response = await fetch('https://apartmentmanagementsystem-backend.onrender.com/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ EmployeeID: employeeId })
      });

      if (response.ok) {
        loadEmployees();
      } else {
        const data = await response.json();
        alert(data.message || 'Check-out failed');
      }
    } catch (error) {
      console.error('Error during check-out:', error);
      alert('Check-out failed');
    }
  };

  useEffect(() => {
    updateDateDisplay();
    loadEmployees();
    const interval = setInterval(loadEmployees, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="employeeAttendanceBody">
      <div className="employeeAttendanceContainer">
        <div className="employeeAttendanceDateHeader" id="currentDateDisplay"></div>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Mobile Number</th>
              <th>Category</th>
              <th>Check In Time</th>
              <th>Check Out Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="employeeTable">
            {employees.map((employee) => (
              <tr key={employee.EmployeeID}>
                <td>{employee.EmployeeID}</td>
                <td>{employee.Name}</td>
                <td>{employee.MobileNumber}</td>
                <td>{employee.Category}</td>
                <td>{formatTime(employee.todayLog?.CheckInTime)}</td>
                <td>{formatTime(employee.todayLog?.CheckOutTime)}</td>
                <td>
                  <button
                    className={`btn btn-success ${employee.todayLog?.CheckInTime ? 'disabled' : ''}`}
                    onClick={() => checkIn(employee.EmployeeID)}
                    disabled={employee.todayLog?.CheckInTime}
                  >
                    Check In
                  </button>
                  <button
                    className={`btn btn-info ${!employee.todayLog?.CheckInTime || employee.todayLog?.CheckOutTime ? 'disabled' : ''}`}
                    onClick={() => checkOut(employee.EmployeeID)}
                    disabled={!employee.todayLog?.CheckInTime || employee.todayLog?.CheckOutTime}
                  >
                    Check Out
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeAttendance;
