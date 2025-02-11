import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../CSS/login.css';

const FlatOwnerLogin = () => {
    const [flatNumber, setFlatNumber] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();

        // Mobile number validation
        if (!/^\d{10}$/.test(mobileNumber)) {
            alert('Mobile number must be a 10-digit number.');
            return;
        }

        // Password validation
        if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
            alert('Password must be at least 8 characters long and alphanumeric.');
            return;
        }

        if (!flatNumber || !mobileNumber || !password) {
            alert('Please enter all fields.');
            return;
        }

        try {
            const response = await fetch('https://apartmentmanagementsystem-q800.onrender.com/f_login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ flat_number: flatNumber, mobile_number: mobileNumber, password: password })
            });

            const data = await response.json();

            if (data.success) {
                  navigate('/flat-owner-dashboard');
                }));

              

            } else {
                alert(data.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <main>
            <section className="section-login" data-aos="fade-up">
                <img src="src/assets/pics/logo.png" alt="Akshya Garden Apartment" className="logo" />
                <div className="container">
                    <h1>Flat Owner Login</h1>
                    <form onSubmit={handleLogin}>
                        <div className="input-group mb-3">
                            <i className="input-icon fas fa-home"></i>
                            <input type="text" id="flat_number" className="form-control" placeholder="Flat Number" required value={flatNumber} onChange={(e) => setFlatNumber(e.target.value)} />
                        </div>
                        <div className="input-group mb-3">
                            <i className="input-icon fas fa-user"></i>
                            <input type="text" id="mobile_number" className="form-control" placeholder="Mobile Number" required value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                        </div>
                        <div className="input-group mb-3">
                            <i className="input-icon fas fa-lock"></i>
                            <input type="password" id="password" className="form-control" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default FlatOwnerLogin;
