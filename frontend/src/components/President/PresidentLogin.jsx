import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'aos/dist/aos.css';
// import styles from '../../CSS/login.css';


const PresidentLogin = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleLogin = async (e) => {
    e.preventDefault();

    // Mobile number validation
    if (!/^\d{10}$/.test(mobileNumber)) {
      let error = '';
      if (mobileNumber === '0') {
        error = 'Mobile number cannot be all zero.';
      } else if (mobileNumber.startsWith('-')) {
        error = 'Mobile number cannot start with a negative sign.';
      } else if (/[a-zA-Z]/.test(mobileNumber)) {
        error = 'Mobile number cannot contain letters.';
      } else if (/[^0-9]/.test(mobileNumber)) {
        error = 'Mobile number cannot contain special characters.';
      } else {
        error = 'Mobile number must be exactly 10 digits.';
      }
      setErrorMessage(error);
      return;
    }

    // Password validation
    if (password.length <= 8) {
      setErrorMessage('Password must be more than 8 characters.');
      return;
    }
    if (password.startsWith('-')) {
      setErrorMessage('Password cannot start with a negative sign.');
      return;
    }
    if (/^\d/.test(password)) {
      setErrorMessage('Password cannot start with a digit.');
      return;
    }
    if (/^0+$/.test(password)) {
      setErrorMessage('Password cannot contain only zeros.');
      return;
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setErrorMessage('Password must be alphanumeric.');
      return;
    }

    try {
      const response = await fetch('https://apartmentmanagementsystem-backend.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile_number: mobileNumber, password: password }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to PresidentDashboard.jsx upon successful login
        navigate('/president-dashboard');
      } else {
        setErrorMessage(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <main>
      <section className="section-login" data-aos="fade-up">
        <img src="src/assets/pics/logo.png" alt="Akshya Garden Apartment" className="logo" />
        <div className="container">
          <h1>President Login</h1>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <i className="input-icon fas fa-user"></i>
              <input
                type="text"
                id="mobile_number"
                className="input-field"
                placeholder="Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <i className="input-icon fas fa-lock"></i>
              <input
                type="password"
                id="password"
                className="input-field"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn">Login</button>
            {errorMessage && (
              <div id="error-message" className="error-message">
                {errorMessage}
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
};

export default PresidentLogin;
