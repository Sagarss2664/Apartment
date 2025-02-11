import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AOS from 'aos';
import ScrollReveal from 'scrollreveal';
import 'aos/dist/aos.css';
import 'boxicons/css/boxicons.min.css';
import 'animate.css/animate.min.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import './index.css';
import Home from './pages/Home';
import PresidentLogin from './components/President/PresidentLogin.jsx';
import FlatOwnerLogin from './components/Owner/FlatOwnerLogin.jsx';
import SecurityLogin from './components/Security/SecurityLogin';
import PresidentDashboard from './components/President/PresidentDashboard.jsx';
import ResidentsInfo from './components/President/ResidentInfo.jsx';
import MarkBillAsPaid from './components/President/MarkBillAsPaid.jsx'; 
import SearchVehicle from './components/President/SearchVehicle.jsx'; 
import VisitorManagement from './components/President/VisitorManagement.jsx';
import ComplaintRecords from './components/President/ComplaintRecords.jsx';
import EmployeeLogs from './components/President/EmployeeLogs.jsx';
import VacancyManagement from './components/President/VacancyManagement.jsx';
import FlatOwnerDashboard from './components/Owner/FlatOwnerDashboard.jsx';
import SecurityDashboard from './components/Security/SecurityDashboard.jsx';
import Vacancy from './components/Security/Vacancy.jsx';
import AddVisitor from './components/Security/AddVisitor.jsx';
import EmployeeAttendance from './components/Security/EmployeeAttendance.jsx';


const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    ScrollReveal({
      distance: '80px',
      duration: 2000,
      delay: 200,
    });

    
    const onScroll = () => {
      const element = document.getElementById("your-element-id");
      if (element) {
        element.classList.add("scrolled");
      }
    };
    window.addEventListener("scroll", onScroll);
    
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <Router>
      <div className="container"> {/* Bootstrap container class for layout */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/president-login" element={<PresidentLogin />} />
          <Route path="/flat-owner-login" element={<FlatOwnerLogin />} />
          <Route path="/security-login" element={<SecurityLogin />} />
          <Route path="/president-dashboard" element={<PresidentDashboard/>}/>
          <Route path="/residents-info" element={<ResidentsInfo/>}/>
          <Route path= "/maintenance-bills" element={<MarkBillAsPaid/>}/>
          <Route path= "/vehicle-search" element={<SearchVehicle/>}/>
          <Route path= "/visitor-logs" element={<VisitorManagement/>}/>
          <Route path= "/complaints" element={<ComplaintRecords/>}/>
          <Route path= "/employee-logs" element={<EmployeeLogs/>}/>
          <Route path= "/vacancy-check" element={<VacancyManagement/>}/>
          import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AOS from 'aos';
import ScrollReveal from 'scrollreveal';
import 'aos/dist/aos.css';
import 'boxicons/css/boxicons.min.css';
import 'animate.css/animate.min.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import './index.css';
import Home from './pages/Home';
import PresidentLogin from './components/President/PresidentLogin.jsx';
import FlatOwnerLogin from './components/Owner/FlatOwnerLogin.jsx';
import SecurityLogin from './components/Security/SecurityLogin';
import PresidentDashboard from './components/President/PresidentDashboard.jsx';
import ResidentsInfo from './components/President/ResidentInfo.jsx';
import MarkBillAsPaid from './components/President/MarkBillAsPaid.jsx'; 
import SearchVehicle from './components/President/SearchVehicle.jsx'; 
import VisitorManagement from './components/President/VisitorManagement.jsx';
import ComplaintRecords from './components/President/ComplaintRecords.jsx';
import EmployeeLogs from './components/President/EmployeeLogs.jsx';
import VacancyManagement from './components/President/VacancyManagement.jsx';
import FlatOwnerDashboard from './components/Owner/FlatOwnerDashboard.jsx';
import SecurityDashboard from './components/Security/SecurityDashboard.jsx';
import Vacancy from './components/Security/Vacancy.jsx';
import AddVisitor from './components/Security/AddVisitor.jsx';
import EmployeeAttendance from './components/Security/EmployeeAttendance.jsx';


const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    ScrollReveal({
      distance: '80px',
      duration: 2000,
      delay: 200,
    });

    
    const onScroll = () => {
      const element = document.getElementById("your-element-id");
      if (element) {
        element.classList.add("scrolled");
      }
    };
    window.addEventListener("scroll", onScroll);
    
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <Router>
      <div className="container"> {/* Bootstrap container class for layout */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/president-login" element={<PresidentLogin />} />
          <Route path="/flat-owner-login" element={<FlatOwnerLogin />} />
          <Route path="/security-login" element={<SecurityLogin />} />
          <Route path="/president-dashboard" element={<PresidentDashboard/>}/>
          <Route path="/residents-info" element={<ResidentsInfo/>}/>
          <Route path= "/maintenance-bills" element={<MarkBillAsPaid/>}/>
          <Route path= "/vehicle-search" element={<SearchVehicle/>}/>
          <Route path= "/visitor-logs" element={<VisitorManagement/>}/>
          <Route path= "/complaints" element={<ComplaintRecords/>}/>
          <Route path= "/employee-logs" element={<EmployeeLogs/>}/>
          <Route path= "/vacancy-check" element={<VacancyManagement/>}/>
          <Route path="/flat-owner-dashboard" element={<FlatOwnerDashboard />} />
          <Route path= "/security-dashboard" element={<SecurityDashboard/>}/>
          <Route path= "/vacancy-check" element={<Vacancy/>}/>
          <Route path= "/add-visitor" element={<AddVisitor/>}/>
          <Route path= "/attendance" element={<EmployeeAttendance/>}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
          <Route path= "/security-dashboard" element={<SecurityDashboard/>}/>
          <Route path= "/vacancy-check" element={<Vacancy/>}/>
          <Route path= "/add-visitor" element={<AddVisitor/>}/>
          <Route path= "/attendance" element={<EmployeeAttendance/>}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
