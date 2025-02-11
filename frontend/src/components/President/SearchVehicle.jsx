import React, { useState } from 'react';
import styles  from '../../CSS/searchVehicle.module.css';

const SearchVehicle = () => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState('');
  const [message, setMessage] = useState('');

  const handleRegistrationNumberChange = (e) => {
    setRegistrationNumber(e.target.value);
  };

  const validateRegistrationNumber = (registrationNumber) => {
    if (!registrationNumber) {
      alert('Registration number is required.');
      return false;
    }

    if (/^-/.test(registrationNumber)) {
      alert('Registration number cannot starts from -ve sign.');
      return false;
    }

    if (registrationNumber === "0") {
      alert('Registration number cannot be zero.');
      return false;
    }

    if (/^\d+$/.test(registrationNumber)) {
      alert('Registration number cannot contain only digits.');
      return false;
    }

    if (/^[A-Za-z]+$/.test(registrationNumber)) {
      alert('Registration number cannot contain only letters.');
      return false;
    }

    const regex = /^[A-Z]{2}[0-9]{1,2}[A-Z]*[0-9]{4}$/;
    if (!regex.test(registrationNumber)) {
      alert(
        `Invalid registration number "${registrationNumber}".\n` +
        'Please enter a valid registration number in the format:\n' +
        'Example: KA49EC1234, DL2CAA5678, MH123456.'
      );
      return false;
    }

    return true;
  };

  const searchVehicle = async () => {
    // Validate the registration number
    if (!validateRegistrationNumber(registrationNumber)) {
      return;
    }

    try {
      const response = await fetch(`https://apartmentmanagementsystem-backend.onrender.com/searchVehicle/${registrationNumber}`);
      const result = await response.json();

      if (result.success) {
        if (result.is_from_apartment) {
          const { vehicle, flat_details } = result;
          const details = (
            <>
              <h3>Vehicle Details</h3>
              <p><strong>Flat Number:</strong> {vehicle.flat_number}</p>
              <p><strong>Vehicle Type:</strong> {vehicle.vehicle_type}</p>
              <p><strong>Registration Number:</strong> {vehicle.registration_number}</p>
              <h4>Flat Details</h4>
              <p><strong>Owner ID:</strong> {flat_details.owner_id || 'N/A'}</p>
              <p><strong>Tenant Name:</strong> {flat_details.tenant_name || 'N/A'}</p>
              <p><strong>Tenant Mobile:</strong> {flat_details.tenant_mobile || 'N/A'}</p>
            </>
          );
          setVehicleDetails(details);
          setMessage('');
        } else {
          setVehicleDetails('');
          setMessage(result.message);
        }
      } else {
        setVehicleDetails('');
        setMessage('Error: Unable to fetch vehicle details.');
      }
    } catch (err) {
      setVehicleDetails('');
      setMessage('Error fetching vehicle details.');
      console.error('Error:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h3>Search Vehicle</h3>
      <label htmlFor="registration_number">Enter Registration Number:</label>
      <input
        type="text"
        id="registration_number"
        value={registrationNumber}
        onChange={handleRegistrationNumberChange}
        placeholder="Enter registration number (e.g., KA48N1432)"
        required
      />
      <button onClick={searchVehicle}>Search Vehicle</button>

      <div className={styles.details}>
        {vehicleDetails ? vehicleDetails : <p>{message}</p>}
      </div>
    </div>
  );
};

export default SearchVehicle;
