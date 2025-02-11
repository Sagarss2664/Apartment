import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const FlatOwnerDashboard = () => {
    const [ownerInfo, setOwnerInfo] = useState({});
    const [tenantInfo, setTenantInfo] = useState({});
    const [familyInfo, setFamilyInfo] = useState({});
    const [vehicles, setVehicles] = useState([]);
    const [newVehicle, setNewVehicle] = useState({ type: '', registration_number: '' });

    useEffect(() => {
        const fetchData = async () => {
            const flatOwnerDetails = JSON.parse(localStorage.getItem('flatOwnerDetails'));
            const flatNumber = flatOwnerDetails.flatNumber;

            try {
                const response = await fetch(`https://apartmentmanagementsystem-backend.onrender.com/getFlatOwnerData?flat_number=${flatNumber}`);
                const data = await response.json();

                if (data.success) {
                    setOwnerInfo(data.owner);
                    setTenantInfo(data.tenant);
                    setFamilyInfo(data.family);
                    setVehicles(data.vehicles);
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleUpdateOwnerInfo = (field, value) => {
        setOwnerInfo({ ...ownerInfo, [field]: value });
    };

    const handleUpdateTenantInfo = (field, value) => {
        setTenantInfo({ ...tenantInfo, [field]: value });
    };

    const handleUpdateFamilyInfo = (field, value) => {
        setFamilyInfo({ ...familyInfo, [field]: value });
    };

    // const handleAddVehicle = async () => {
    //     if (!newVehicle.type || !newVehicle.registration_number) {
    //         alert('Please fill in all vehicle details.');
    //         return;
    //     }

    //     const response = await fetch(`https://apartmentmanagementsystem-backend.onrender.com/addVehicle`, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ flat_number: ownerInfo.flat_number, ...newVehicle })
    //     });

    //     const data = await response.json();
    //     if (data.success) {
    //         setVehicles([...vehicles, newVehicle]);
    //         setNewVehicle({ type: '', registration_number: '' });
    //     } else {
    //         alert(data.message);
    //     }
    // };

    // const handleDeleteVehicle = async (registration_number) => {
    //     const response = await fetch(`https://apartmentmanagementsystem-backend.onrender.com/deleteVehicle`, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ flat_number: ownerInfo.flat_number, registration_number })
    //     });

    //     const data = await response.json();
    //     if (data.success) {
    //         setVehicles(vehicles.filter(vehicle => vehicle.registration_number !== registration_number));
    //     } else {
    //         alert(data.message);
    //     }
    // };
    const handleAddVehicle = async () => {
        if (!newVehicle.type || !newVehicle.registration_number) {
            alert('Please fill in all vehicle details.');
            return;
        }
    
        const flatOwnerDetails = JSON.parse(localStorage.getItem('flatOwnerDetails'));
        const flatNumber = flatOwnerDetails?.flatNumber; // Ensure flatNumber is retrieved
    
        if (!flatNumber) {
            alert("Flat number not found. Please log in again.");
            return;
        }
    
        try {
            const response = await fetch(`https://apartmentmanagementsystem-backend.onrender.com/addVehicle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    type: newVehicle.type, 
                    registration_number: newVehicle.registration_number ,
                    flat_number: flatNumber
                })
            });
    
            const data = await response.json();
            console.log("Vehicle Add Response:", data); // Debugging log
    
            if (data.success) {
                setVehicles([...vehicles, { type: newVehicle.type, registration_number: newVehicle.registration_number ,flat_number:flatNumber}]);
                setNewVehicle({ type: '', registration_number: '' });
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error adding vehicle:', error);
        }
    };
    
    const handleDeleteVehicle = async (registration_number) => {
        const flatOwnerDetails = JSON.parse(localStorage.getItem('flatOwnerDetails'));
        const flatNumber = flatOwnerDetails?.flatNumber; // Get correct flat number
    
        if (!flatNumber) {
            alert("Flat number not found. Please log in again.");
            return;
        }
    
        try {
            const response = await fetch(`https://apartmentmanagementsystem-backend.onrender.com/deleteVehicle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ flat_number: flatNumber, registration_number })
            });
    
            const data = await response.json();
            console.log("Vehicle Delete Response:", data); // Debugging log
    
            if (data.success) {
                setVehicles(vehicles.filter(vehicle => vehicle.registration_number !== registration_number));
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error deleting vehicle:', error);
        }
    };
    
    const handleUpdateAllDetails = async () => {
        try {
            const flatOwnerDetails = JSON.parse(localStorage.getItem('flatOwnerDetails'));
            const flatNumber = flatOwnerDetails?.flatNumber; // Ensure correct key
    
            const response = await fetch(`https://apartmentmanagementsystem-backend.onrender.com/updateAllDetails`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    flat_number: flatNumber, // Use correct flat number
                    owner: ownerInfo,
                    tenant: tenantInfo,
                    family: familyInfo,
                    vehicles: vehicles
                })
            });
    
            const data = await response.json();
            if (data.success) {
                alert('All details updated successfully!');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error updating details:', error);
        }
    };
    
    return (
        <div className="container">
            <h1>Flat Owner Dashboard</h1>
            <h2>Owner Information</h2>
            <div>
                <p>Name: <input type="text" value={ownerInfo.name || ''} onChange={(e) => handleUpdateOwnerInfo('name', e.target.value)} /></p>
                <p>Mobile: <input type="text" value={ownerInfo.mobile || ''} onChange={(e) => handleUpdateOwnerInfo('mobile', e.target.value)} /></p>
                <p>Email: <input type="text" value={ownerInfo.email || ''} onChange={(e) => handleUpdateOwnerInfo('email', e.target.value)} /></p>
                <p>Aadhaar Number: <input type="text" value={ownerInfo.aadhaar_number || ''} onChange={(e) => handleUpdateOwnerInfo('aadhaar_number', e.target.value)} /></p>
            </div>

            <h2>Tenant Information</h2>
            <div>
                <p>Name: <input type="text" value={tenantInfo.tenant_name || ''} onChange={(e) => handleUpdateTenantInfo('tenant_name', e.target.value)} /></p>
                <p>Mobile: <input type="text" value={tenantInfo.tenant_mobile || ''} onChange={(e) => handleUpdateTenantInfo('tenant_mobile', e.target.value)} /></p>
                <p>Email: <input type="text" value={tenantInfo.tenant_email || ''} onChange={(e) => handleUpdateTenantInfo('tenant_email', e.target.value)} /></p>
                <p>Aadhaar Number: <input type="text" value={tenantInfo.tenant_aadhaar_number || ''} onChange={(e) => handleUpdateTenantInfo('tenant_aadhaar_number', e.target.value)} /></p>
            </div>

            <h2>Family Information</h2>
            <div>
                <p>Number of Members: <input type="number" value={familyInfo.number_of_members || ''} onChange={(e) => handleUpdateFamilyInfo('number_of_members', e.target.value)} /></p>
                <p>Male Count: <input type="number" value={familyInfo.male_count || ''} onChange={(e) => handleUpdateFamilyInfo('male_count', e.target.value)} /></p>
                <p>Female Count: <input type="number" value={familyInfo.female_count || ''} onChange={(e) => handleUpdateFamilyInfo('female_count', e.target.value)} /></p>
                <p>Child Count: <input type="number" value={familyInfo.child_count || ''} onChange={(e) => handleUpdateFamilyInfo('child_count', e.target.value)} /></p>
            </div>

            <button onClick={handleUpdateAllDetails} style={{ marginTop: '20px' }}>Update All Details</button>
            
            <h2>Vehicle Information</h2>
            <div>
                {vehicles.map((vehicle, index) => (
                    <div key={index}>
                        <p>Type: {vehicle.vehicle_type} | Registration Number: {vehicle.registration_number} 
                            <button onClick={() => handleDeleteVehicle(vehicle.registration_number)}>Delete</button>
                        </p>
                    </div>
                ))}
                <h3>Add New Vehicle</h3>
                <input type="text" placeholder="Vehicle Type" value={newVehicle.type} onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })} />
                <input type="text" placeholder="Registration Number" value={newVehicle.registration_number} onChange={(e) => setNewVehicle({ ...newVehicle, registration_number: e.target.value })} />
                <button onClick={handleAddVehicle}>Add Vehicle</button>
            </div>

            
        </div>
    );
};

export default FlatOwnerDashboard;
