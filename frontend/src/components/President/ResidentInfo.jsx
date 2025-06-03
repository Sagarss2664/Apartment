import React, { useState, useEffect } from 'react';
import styles from '../../CSS/residents_info.module.css';

const ResidentsInfo = () => {
    const [flatNumbers, setFlatNumbers] = useState([]);
    const [selectedFlatNumber, setSelectedFlatNumber] = useState('');
    const [flatDetails, setFlatDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        loadFlatNumbers();
    }, []);

    // Fetch flat numbers from the server
    const loadFlatNumbers = async () => {
        try {
            const response = await fetch('http://34.121.192.129/getFlatNumbers');
            const result = await response.json();

            if (result.success && result.flat_numbers.length > 0) {
                setFlatNumbers(result.flat_numbers);
            } else {
                setFlatNumbers([]);
                setErrorMessage('No flat numbers available.');
            }
        } catch (err) {
            setFlatNumbers([]);
            setErrorMessage('Error fetching flat numbers.');
            console.error('Error fetching flat numbers:', err);
        }
    };

    // Fetch details of the selected flat
    const fetchFlatDetails = async () => {
        if (!selectedFlatNumber) {
            setErrorMessage('Please select a flat number!');
            return;
        }

        try {
            const response = await fetch(`http://34.121.192.129/getFlatDetails/${selectedFlatNumber}`);
            const result = await response.json();

            if (result.success) {
                setFlatDetails(result.flat_details);
                setErrorMessage('');
            } else {
                setErrorMessage(result.message || 'Flat details not found.');
                setFlatDetails(null);
            }
        } catch (err) {
            setErrorMessage('Error fetching flat details.');
            console.error('Error:', err);
            setFlatDetails(null);
        }
    };

    return (
        <div className={styles.container}>
            <h3>Residents Information</h3>
            <div className={styles.selector}>
                <label htmlFor="flat_number">Select Flat Number:</label>
                <select
                    id="flat_number"
                    value={selectedFlatNumber}
                    onChange={(e) => setSelectedFlatNumber(e.target.value)}
                >
                    <option value="">-- Select Flat Number --</option>
                    {flatNumbers.map((flatNumber) => (
                        <option key={flatNumber} value={flatNumber}>
                            {flatNumber}
                        </option>
                    ))}
                </select>
                <button onClick={fetchFlatDetails}>Fetch Details</button>
            </div>

            {errorMessage && <p className={styles.error}>{errorMessage}</p>}

            {flatDetails && (
                <div className={styles.details} id="flatDetails">
                    <h3>Flat Details</h3>

                    {/* Owner Information */}
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th colSpan="2">Owner Information</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Name:</strong></td>
                                <td>{flatDetails.name || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td><strong>Mobile:</strong></td>
                                <td>{flatDetails.mobile || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td><strong>Email:</strong></td>
                                <td>{flatDetails.email || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Tenant Information */}
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th colSpan="2">Tenant Information</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Name:</strong></td>
                                <td>{flatDetails.tenant_name || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td><strong>Mobile:</strong></td>
                                <td>{flatDetails.tenant_mobile || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td><strong>Email:</strong></td>
                                <td>{flatDetails.tenant_email || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Family Details */}
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th colSpan="2">Family Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Total Members:</strong></td>
                                <td>{flatDetails.family?.number_of_members || '0'}</td>
                            </tr>
                            <tr>
                                <td><strong>Male Count:</strong></td>
                                <td>{flatDetails.family?.male_count || '0'}</td>
                            </tr>
                            <tr>
                                <td><strong>Female Count:</strong></td>
                                <td>{flatDetails.family?.female_count || '0'}</td>
                            </tr>
                            <tr>
                                <td><strong>Child Count:</strong></td>
                                <td>{flatDetails.family?.child_count || '0'}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Vehicle Information */}
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Vehicle Type</th>
                                <th>Registration Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flatDetails.vehicles && flatDetails.vehicles.length > 0 ? (
                                flatDetails.vehicles.map((vehicle, index) => (
                                    <tr key={index}>
                                        <td>{vehicle.vehicle_type}</td>
                                        <td>{vehicle.registration_number}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2">No vehicles found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ResidentsInfo;
