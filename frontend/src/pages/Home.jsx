import React from 'react';
import { Link } from 'react-router-dom';
import 'aos/dist/aos.css';
import 'boxicons/css/boxicons.min.css';
import 'animate.css/animate.min.css';
import '../index.css'; // Correct the path

const Home = () => {
  return (
    <section id="home" className="home">
      <div className="hero-content" data-aos="fade-up">
        <h1 className="animate__animated animate__backInDown">
          Welcome to <span>Akshya Garden</span>
        </h1>
        <p className="animate__animated animate__fadeInTopLeft">
          Experience luxury living in harmony with nature
        </p>
        <div className="button-group">
          <Link to="/president-login">
            <button className="btn btn-primary">
              President Login
            </button>
          </Link>
          <Link to="/flat-owner-login">
            <button className="btn btn-primary">
              Flat Owner Login
            </button>
          </Link>
          <Link to="/security-login">
            <button className="btn btn-primary">
              Security Login
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
