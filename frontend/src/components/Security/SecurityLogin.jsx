import React, { useState } from 'react';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import styles from '../../CSS/login.css';
import { Navigate } from 'react-router-dom';

const SecurityLogin = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // Mobile number validation
    if (!/^\d{10}$/.test(mobileNumber)) {
      let error = '';
      if (mobileNumber === '0') {
        error = 'Mobile number cannot be zero.';
      } else if (mobileNumber.startsWith('-')) {
        error = 'Mobile number cannot start with a negative sign.';
      } else if (/[a-zA-Z]/.test(mobileNumber)) {
        error = 'Mobile number cannot contain letters.';
      } else if (/[^a-zA-Z0-9]/.test(mobileNumber)) {
        error = 'Mobile number cannot contain special characters.';
      } else {
        error = 'Mobile number must be a 10-digit number.';
      }
      setErrorMessage(error);
      return;
    }

    // Password validation
    if (password.length <= 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      setErrorMessage('Password must be more than 8 characters and alphanumeric.');
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
      setErrorMessage('Password cannot consist of only zeros.');
      return;
    }
    if (!/[@$%&]/.test(password)) {
      setErrorMessage('Password must contain at least one special character (@, $, %, &).');
      return;
    }

    // If validation passes, proceed with login
    try {
      const response = await fetch('https://apartmentmanagementsystem-q800.onrender.com/s_login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile_number: mobileNumber, password: password }),
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = '/security-dashboard'; // Ensure the file path is correct
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
        <div className="container">
          <div className="text-center">
            <img src="src/assets/pics/logo.png" alt="Akshya Garden Apartment" className="logo mb-4" />
            <h1 className="mb-4">Security Login</h1>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="mobile_number" className="form-label">Mobile Number</label>
              <input
                type="text"
                id="mobile_number"
                className="form-control"
                placeholder="Enter Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
            {errorMessage && (
              <div id="error-message" className="alert alert-danger">
                {errorMessage}
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
};

export default SecurityLogin;
