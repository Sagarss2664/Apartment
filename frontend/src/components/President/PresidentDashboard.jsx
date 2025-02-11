import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'boxicons/css/boxicons.min.css';
import 'animate.css/animate.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../CSS/PresidentDashboard.module.css'; // Updated CSS file

const PresidentDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <img
          src="src/assets/logo.png"
          alt="Akshya Garden Apartment"
          className="dashboard-logo-img"
        />
        <a href="#" className="dashboard-logo-text">
          President Dashboard
        </a>
      </header>

      <section className="dashboard-main">
        <h2 className="dashboard-title" data-aos="fade-up">
          Welcome to <span className="dashboard-highlight">President Dashboard</span>
        </h2>

        <div className="dashboard-card-info" data-aos="fade-up">
          <h3>Residents Info</h3>
          <p>
            Get a complete overview of all residents and their contact information. Perfect for
            staying connected and ensuring everyone’s well-being.
          </p>
          <button
            className="dashboard-btn"
            onClick={() => navigate('/residents-info')}
          >
            <i className="bx bx-link-external"></i> View Details
          </button>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card" data-aos="fade-up">
            <h3>Maintenance Bills</h3>
            <p>Easily update and track maintenance bills for all flats.</p>
            <button
              className="dashboard-btn"
              onClick={() => navigate('/maintenance-bills')}
            >
              <i className="bx bx-link-external"></i> View Details
            </button>
          </div>

          <div className="dashboard-card" data-aos="fade-up" data-aos-delay="100">
            <h3>Vehicle Search</h3>
            <p>Identify vehicle owners within the community by registration number.</p>
            <button
              className="dashboard-btn"
              onClick={() => navigate('/vehicle-search')}
            >
              <i className="bx bx-link-external"></i> View Details
            </button>
          </div>

          <div className="dashboard-card" data-aos="fade-up" data-aos-delay="200">
            <h3>Visitor Logs</h3>
            <p>Access detailed visitor logs to ensure safety within the premises.</p>
            <button
              className="dashboard-btn"
              onClick={() => navigate('/visitor-logs')}
            >
              <i className="bx bx-link-external"></i> View Details
            </button>
          </div>

          <div className="dashboard-card" data-aos="fade-up">
            <h3>Complaints</h3>
            <p>Review complaints submitted by residents and address concerns.</p>
            <button
              className="dashboard-btn"
              onClick={() => navigate('/complaints')}
            >
              <i className="bx bx-link-external"></i> View Details
            </button>
          </div>

          <div className="dashboard-card" data-aos="fade-up" data-aos-delay="100">
            <h3>Employee Logs</h3>
            <p>View daily logs of staff to maintain accountability and efficiency.</p>
            <button
              className="dashboard-btn"
              onClick={() => navigate('/employee-logs')}
            >
              <i className="bx bx-link-external"></i> View Details
            </button>
          </div>

          <div className="dashboard-card" data-aos="fade-up" data-aos-delay="200">
            <h3>Vacancy Check</h3>
            <p>Track flat vacancies to ensure extra security or handle arrangements.</p>
            <button
              className="dashboard-btn"
              onClick={() => navigate('/vacancy-check')}
            >
              <i className="bx bx-link-external"></i> View Details
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PresidentDashboard;
