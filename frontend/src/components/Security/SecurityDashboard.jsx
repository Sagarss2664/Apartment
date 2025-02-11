import React, { useEffect, useState } from 'react';
import styles from '../../CSS/SecurityDashboard.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
const SecurityDashboard = () => {
    const [data, setData] = useState({ name: 'User' }); // Mock data

    useEffect(() => {
        // Mock database fetch simulation
        document.querySelector('.personalInfo h2').textContent = `Welcome, ${data.name}`;
    }, [data]);

    return (
        <div className="bodyContainer">
            <header className="headerContainer">
                <img src="../pics/logo.png" alt="Akshya Garden Apartment" className="logoImg" />
                <a href="#" className="logo">Security Dashboard</a>
            </header>

            <div className="dashboardContainer">
                <div className="personalInfo">
                    <h2>Welcome to Security Dashboard</h2>
                </div>

                <div className="buttonContainer">
                    <button className="functionButton" onClick={() => window.location.href='/attendance'}>Employee Attendance</button>
                    <button className="functionButton" onClick={() => window.location.href='/vacancy-check'}>View Vacancies</button>
                    <button className="functionButton" onClick={() => window.location.href='/add-visitor'}>Visitor Management</button>
                </div>
            </div>
        </div>
        
    );
};

export default SecurityDashboard;
