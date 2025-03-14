import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors({
    origin: '*',
}));

// Body parser middleware
app.use(express.json());




// Define the schemas
const ownerSchema = new mongoose.Schema({
    owner_id: { type: Number, unique: true, required: true },
    name: String,
    mobile: String,
    email: String,
    aadhaar_number: String,
});

const flatSchema = new mongoose.Schema({
    flat_number: { type: String, unique: true, required: true },
    owner_id: { type: Number, required: true },
    is_owner_residing: Boolean,
    tenant_name: String,
    tenant_mobile: String,
    tenant_email: String,
    tenant_aadhaar_number: String,
});

const vehicleSchema = new mongoose.Schema({
    vehicle_type: String,
    registration_number: String,
    flat_number: { type: String, required: true },
});

const familySchema = new mongoose.Schema({
    flat_number: { type: String, required: true },
    number_of_members: Number,
    male_count: Number,
    female_count: Number,
    child_count: Number,
});

// Define the models with explicit collection names
const Owner = mongoose.model('Owner', ownerSchema, 'owner'); // Specify 'owner' as the collection name
const Flat = mongoose.model('Flat', flatSchema, 'flats'); // Explicitly set collection name if needed
const Vehicle = mongoose.model('Vehicle', vehicleSchema, 'vehicledetails');
const Family = mongoose.model('Family', familySchema, 'familydetails');



// MongoDB Connection
const mongoURI = process.env.MONGO_URI;  // Make sure to add MONGO_URI in your .env file

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));
// Route to get flat details
app.get('/getFlatDetails/:flat_number', async (req, res) => {
    const flatNumber = req.params.flat_number;

    try {
        // Fetch flat details
        const flat = await Flat.findOne({ flat_number: flatNumber });
        if (!flat) {
            return res.json({ success: false, message: 'Flat not found!' });
        }

        console.log('Flat Details:', flat);

        // Fetch owner details
        let owner = null;
        if (flat.owner_id) {
            owner = await Owner.findOne({ owner_id: flat.owner_id });
        }
        console.log('Owner Details:', owner);

        // Fetch vehicle details
        const vehicles = await Vehicle.find({ flat_number: flatNumber });

        // Fetch family details
        const family = await Family.findOne({ flat_number: flatNumber });

        res.json({
            success: true,
            flat_details: {
                flat_number: flat.flat_number,
                owner_id: flat.owner_id,
                name: owner ? owner.name : 'N/A',
                mobile: owner ? owner.mobile : 'N/A',
                email: owner ? owner.email : 'N/A',
                tenant_name: flat.tenant_name || 'N/A',
                tenant_mobile: flat.tenant_mobile || 'N/A',
                tenant_email: flat.tenant_email || 'N/A',
                tenant_aadhaar_number: flat.tenant_aadhaar_number || 'N/A',
                vehicles: vehicles.map(vehicle => ({
                    vehicle_type: vehicle.vehicle_type,
                    registration_number: vehicle.registration_number,
                })),
                family: family || {
                    number_of_members: 0,
                    male_count: 0,
                    female_count: 0,
                    child_count: 0,
                },
            },
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
});


//

  app.post('/pchangepassword', async (req, res) => {
    const { mobile_number, currentPassword, newPassword } = req.body;
  
    try {
      const user = await Login.findOne({ mobile_number });
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      if (user.password !== currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }
  
      user.password = newPassword;
      await user.save();
  
      res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });



// Endpoint to change password
app.post('/changePassword', async (req, res) => {
    const { flat_number, currentPassword, newPassword } = req.body;

    try {
        // Find the user by flat number
        const user = await FLogin.findOne({ flat_number });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if the current password matches
        if (user.password !== currentPassword) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        // Update the password
        user.password = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});




app.post('/change-security-password', async (req, res) => {
    const { mobile_number, currentPassword, newPassword } = req.body;
  
    try {
      const user = await SLogin.findOne({ mobile_number });
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      if (user.password !== currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }
  
      user.password = newPassword;
      await user.save();
  
      res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
//New passwrds changes

  app.post('/president_reset_password', async (req, res) => {
    try {
      const { mobile_number, aadhaar_last4, new_password } = req.body;
  
      // Check if all fields are provided
      if (!mobile_number || !aadhaar_last4 || !new_password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }
  
      // Find president by mobile number
      const user = await Login.findOne({ mobile_number });
  
      // Check if user exists and Aadhaar last 4 digits match
      if (!user || user.aadhaar_number.slice(-4) !== aadhaar_last4) {
        return res.status(400).json({ success: false, message: 'Invalid details' });
      }
  
      // Hash new password
      //const hashedPassword = await bcrypt.hash(new_password, 10);
  
      // Update password
      user.password = new_password;
      await user.save();
  
      res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });


  app.post('/security_reset_password', async (req, res) => {
    try {
      const { mobile_number, aadhaar_last4, new_password } = req.body;
  
      // Check if all fields are provided
      if (!mobile_number || !aadhaar_last4 || !new_password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }
  
      // Find president by mobile number
      const user = await SLogin.findOne({ mobile_number });
  
      // Check if user exists and Aadhaar last 4 digits match
      if (!user || user.aadhaar_number.slice(-4) !== aadhaar_last4) {
        return res.status(400).json({ success: false, message: 'Invalid details' });
      }
  
      // Hash new password
      //const hashedPassword = await bcrypt.hash(new_password, 10);
  
      // Update password
      user.password = new_password;
      await user.save();
  
      res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });


app.post('/f_forgot_password', async (req, res) => {
    try {
        const { flat_number, mobile_number, aadhaar_last4, new_password } = req.body;

        // Validate input
        if (!flat_number || !mobile_number || !aadhaar_last4 || !new_password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (!/^\d{10}$/.test(mobile_number)) {
            return res.status(400).json({ success: false, message: 'Invalid mobile number' });
        }

        if (!/^\d{4}$/.test(aadhaar_last4)) {
            return res.status(400).json({ success: false, message: 'Aadhaar last 4 digits must be exactly 4 numbers' });
        }

        if (new_password.length < 8 || !/[a-zA-Z]/.test(new_password) || !/[0-9]/.test(new_password)) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long and alphanumeric' });
        }

        // Find flat details
        const flat = await Flat.findOne({ flat_number });
        if (!flat) {
            return res.status(404).json({ success: false, message: 'Flat not found' });
        }

        let user = null;
        let expectedAadhaarLast4 = '';

        if (flat.is_owner_residing) {
            // Fetch owner details
            user = await Owner.findOne({ owner_id: flat.owner_id, mobile: mobile_number });
            if (user) expectedAadhaarLast4 = user.aadhaar_number.slice(-4);
        } else {
            // Check tenant details
            if (flat.tenant_mobile === mobile_number) {
                expectedAadhaarLast4 = flat.tenant_aadhaar_number.slice(-4);
                user = { flat_number }; // Dummy object to allow password reset
            }
        }

        if (!user || expectedAadhaarLast4 !== aadhaar_last4) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Find user login data
        const loginUser = await FLogin.findOne({ flat_number });
        if (!loginUser) {
            return res.status(404).json({ success: false, message: 'User login data not found' });
        }

        // **FIX: Hash the new password before saving**
        //const hashedPassword = await bcrypt.hash(new_password, 10);
        loginUser.password = new_password;
        await loginUser.save();

        res.json({ success: true, message: 'Password reset successful' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});









// Bill Logs Schema
const billLogsSchema = new mongoose.Schema({
    flat_number: String,
    status: { type: String, default: 'Unpaid' },
    date: String,
    time: String,
    utr_number: { type: String, default: null }, // New field added
});

billLogsSchema.statics.resetMonthlyBills = async function () {
    await this.updateMany({}, { status: 'Unpaid', date: null, time: null, utr_number: null });
};




const visitorLogSchema = new mongoose.Schema({
    visitor_name: { type: String, required: true },
    flat_number: { type: String, required: true },
    purpose: { type: String, required: true },
    entry_datetime: { type: String, required: true },
    exit_datetime: { type: String },
    status: { type: String, default: 'Active' }
});

const Visitor = mongoose.model('visitorlogs', visitorLogSchema);
// Define the Vacancy schema and model
const vacancySchema = new mongoose.Schema({
    flat_number: String,
    no_of_days_to_be_vacant: Number,
    reason: String
});
// Complaint Record Schema
const complaintRecordSchema = new mongoose.Schema({
    flat_number: { type: String, required: true },
    complaint: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, default: 'pending' },
    date: { type: Date, default: Date.now }
});

app.post('/s_login', async (req, res) => {
    const { mobile_number, password } = req.body;

    if (!mobile_number || !password) {
        return res.status(400).json({ success: false, message: 'Mobile number and password are required' });
    }

    try {
        // Validate the login credentials from s_login collection
        const user = await SLogin.findOne({ mobile_number, password });

        if (user) {
            res.status(200).json({
                success: true,
                message: 'Login successful',
                name: `Student with Mobile Number: ${mobile_number}`, // or any other name field if needed
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


// Schema and Model
// Define the Login schema and model
const loginSchema = new mongoose.Schema({
    mobile_number: String,
    password: String,
    aadhaar_number: String,
  });
  
  const Login = mongoose.model('Login', loginSchema, 'Login');

  const fLoginSchema = new mongoose.Schema({
    flat_number: String,
    mobile_number: String,
    password: String,
});

// Define the s_login schema
const sLoginSchema = new mongoose.Schema({
    mobile_number: String,
    password: String,
    aadhaar_number: String,
});

const SLogin = mongoose.model('SLogin', sLoginSchema,'s_login');

const FLogin = mongoose.model('FLogin', fLoginSchema,'f_login');

// Models

const ComplaintRecord = mongoose.model('ComplaintRecord', complaintRecordSchema);
const Vacancy = mongoose.model('Vacancy', vacancySchema);
// Model for Visitor Log
// Notice 'visitorlogs' collection

const BillLogs = mongoose.model('bills_logs', billLogsSchema);


//////////////////////////////////////////////////////////////////////////////
// Employeee
// Schemas
const EmployeeSchema = new mongoose.Schema({
    EmployeeID: Number,
    Name: String,
    MobileNumber: String,
    Category: String
});

const LogSchema = new mongoose.Schema({
    EmployeeID: Number,
    Date: String,
    CheckInTime: Date,
    CheckOutTime: Date
});

// Models
const Employee = mongoose.model('employeedetails', EmployeeSchema);
const Log = mongoose.model('employeelogs', LogSchema);


app.post('/login', async (req, res) => {
    const { mobile_number, password } = req.body;
  
    // Ensure mobile number and password are provided
    if (!mobile_number || !password) {
      return res.status(400).json({ success: false, message: 'Mobile number and password are required' });
    }
  
    // Clean the mobile number and password fields (trim and cast to string)
    const cleanedMobileNumber = String(mobile_number).trim();
    const cleanedPassword = String(password).trim();
  
    console.log("Received mobile_number:", cleanedMobileNumber);
    console.log("Received password:", cleanedPassword);
  
    try {
      // Log the query before executing it
      console.log("Querying MongoDB with:", { mobile_number: cleanedMobileNumber, password: cleanedPassword });
  
      // Search for the user in the database
      const user = await Login.findOne({
        mobile_number: cleanedMobileNumber,
        password: cleanedPassword
      });
  
      // Log the result from MongoDB
      console.log("Result from MongoDB:", user);
  
      if (user) {
        res.status(200).json({
          success: true,
          message: 'Login successful',
          user,
        });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
// POST route for login validation
app.post('/f_login', async (req, res) => {
    const { mobile_number, password, flat_number } = req.body;

    if (!mobile_number || !password || !flat_number) {
        return res.status(400).json({ success: false, message: 'Mobile number, password, and flat number are required' });
    }

    try {
        // Validate the login credentials from the f_login collection
        const user = await FLogin.findOne({ flat_number, mobile_number, password });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Get flat details to decide whether to return owner or tenant details
        const flat = await Flat.findOne({ flat_number });
        if (!flat) {
            return res.status(404).json({ success: false, message: 'Flat not found' });
        }

        if (flat.is_owner_residing) {
            // If the owner is residing, return owner's name
            const owner = await Owner.findOne({ owner_id: flat.owner_id });
            
                res.status(200).json({
                    success: true,
                    name: owner.name,
                    mobile:owner.mobile,
                    email:owner.email,
                    is_owner_residing: true
                });
           
        } else {
            // If the tenant is residing, return tenant's name
                res.status(200).json({
                    success: true,
                    name: flat.tenant_name,
                    mobile:flat.tenant_mobile,
                    email:flat.tenant_email,
                    is_owner_residing: false
                });
            
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/getFlatNumbers', async (req, res) => {
    try {
        const flats = await Flat.find({}, { flat_number: 1 });
        const flatNumbers = flats.map(flat => flat.flat_number);
        res.json({ success: true, flat_numbers: flatNumbers });
    } catch (err) {
        console.error('Error fetching flat numbers:', err);
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
});

/////////////////////////////////////

// Authentication Endpoint
app.post('/login', async (req, res) => {
    const { flat_number, mobile, password } = req.body;

    try {
        // Fetch flat details
        const flat = await Flat.findOne({ flat_number });
        if (!flat) {
            return res.status(404).json({ success: false, message: 'Flat not found' });
        }

        // Fetch owner details
        const owner = await Owner.findOne({ owner_id: flat.owner_id });
        if (!owner) {
            return res.status(404).json({ success: false, message: 'Owner not found' });
        }

        // Validate mobile and password (password validation is just a placeholder)
        if (owner.mobile !== mobile || password !== 'defaultPassword') {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Return success and flat number for session management
        res.json({ success: true, flat_number, owner_id: owner.owner_id });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Fetch All Details Endpoint
app.get('/getFlatOwnerData', async (req, res) => {
    const { flat_number } = req.query;

    try {
        // Fetch flat details
        const flat = await Flat.findOne({ flat_number });
        if (!flat) {
            return res.status(404).json({ success: false, message: 'Flat not found' });
        }

        // Fetch owner details
        const owner = await Owner.findOne({ owner_id: flat.owner_id });
        if (!owner) {
            return res.status(404).json({ success: false, message: 'Owner not found' });
        }

        // Fetch family details
        const family = await Family.findOne({ flat_number });
        if (!family) {
            return res.status(404).json({ success: false, message: 'Family details not found' });
        }

        // Fetch vehicle details
        const vehicles = await Vehicle.find({ flat_number });
        if (!vehicles) {
            return res.status(404).json({ success: false, message: 'Vehicle details not found' });
        }

        // Return all details
        res.json({
            success: true,
            owner,
            tenant: {
                tenant_name: flat.tenant_name,
                tenant_mobile: flat.tenant_mobile,
                tenant_email: flat.tenant_email,
                tenant_aadhaar_number: flat.tenant_aadhaar_number,
            },
            family,
            vehicles,
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Update All Details Endpoint
app.post('/updateAllDetails', async (req, res) => {
    const { flat_number, owner, tenant, family, vehicles } = req.body;

    try {
        // Update owner details
        await Owner.findOneAndUpdate({ owner_id: owner.owner_id }, owner);

        // Update flat (tenant) details
        await Flat.findOneAndUpdate({ flat_number }, {
            tenant_name: tenant.tenant_name,
            tenant_mobile: tenant.tenant_mobile,
            tenant_email: tenant.tenant_email,
            tenant_aadhaar_number: tenant.tenant_aadhaar_number,
        });

        // Update family details
        await Family.findOneAndUpdate({ flat_number }, family);

        // Update vehicle details
        await Vehicle.deleteMany({ flat_number }); // Delete existing vehicles
        await Vehicle.insertMany(vehicles.map(vehicle => ({ ...vehicle, flat_number }))); // Insert new vehicles

        res.json({ success: true, message: 'All details updated successfully!' });
    } catch (error) {
        console.error('Error updating details:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
// D:\React Apartment\apartmentApp\src\components
// Add Vehicle
app.post('/addVehicle', async (req, res) => {
    try {
        const { type, registration_number, flat_number } = req.body; // Change vehicle_type to type
        if (!type || !registration_number || !flat_number) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }
        
        const newVehicle = new Vehicle({ vehicle_type: type, registration_number, flat_number }); // Map type to vehicle_type
        await newVehicle.save();
        res.json({ success: true, message: 'Vehicle added successfully.' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Registration number already exists.' });
        }
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Delete Vehicle
app.post('/deleteVehicle', async (req, res) => {
    try {
        const { registration_number, flat_number } = req.body;
        if (!registration_number || !flat_number) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }
        
        const deletedVehicle = await Vehicle.findOneAndDelete({ registration_number, flat_number });
        if (!deletedVehicle) {
            return res.status(404).json({ success: false, message: 'Vehicle not found.' });
        }
        
        res.json({ success: true, message: 'Vehicle deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});




/////////////////////////////

// Endpoint to search for a vehicle by registration number
app.get('/searchVehicle/:registration_number', async (req, res) => {
    const registrationNumber = req.params.registration_number;

    try {
        // Check if the vehicle exists in your apartment
        const vehicle = await Vehicle.findOne({ registration_number: registrationNumber });
        if (vehicle) {
            const flatDetails = await Flat.findOne({ flat_number: vehicle.flat_number });
            const familyDetails = await Family.findOne({ flat_number: vehicle.flat_number });

            return res.json({
                success: true,
                is_from_apartment: true,
                vehicle: {
                    flat_number: vehicle.flat_number,
                    vehicle_type: vehicle.vehicle_type,
                    registration_number: vehicle.registration_number,
                },
                flat_details: flatDetails || { message: 'Flat details not found.' },
                family_details: familyDetails || { message: 'Family details not found.' },
            });
        }

        // Vehicle not found in your apartment
        res.json({
            success: true,
            is_from_apartment: false,
            message: 'Vehicle does not belong to your apartment.',
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
});


app.post('/markBillAsPaid', async (req, res) => {
    const { flat_number, utr_number } = req.body;

    // Validation for flat number
    if (!/^[A-J](10|[1-9])$/.test(flat_number)) {
        return res.status(400).json({
            success: false,
            message: `Flat number "${flat_number}" is invalid. Valid flat numbers start with A-J and are followed by 1-10.`,
        });
    }

    // Validation for UTR number
    if (!/^\d{12}$/.test(utr_number)) {
        return res.status(400).json({
            success: false,
            message: 'UTR number must be a 12-digit numeric value.',
        });
    }

    try {
        const existingBill = await BillLogs.findOne({ flat_number, status: 'Paid' });
        if (existingBill) {
            return res.json({ success: false, message: 'Bill is already marked as paid for this flat number.' });
        }

        const updatedBill = await BillLogs.findOneAndUpdate(
            { flat_number, status: 'Unpaid' },
            {
                status: 'Paid',
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString(),
                utr_number,
            },
            { new: true }
        );

        if (!updatedBill) {
            return res.json({ success: false, message: 'No unpaid bill found for the given flat number!' });
        }

        res.json({ success: true, message: 'Bill marked as paid successfully!', updatedBill });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
});



// Endpoint to fetch bill logs by status
app.get('/getBillLogs/:status', async (req, res) => {
    const { status } = req.params;

    if (!['Paid', 'Unpaid'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status! Use "Paid" or "Unpaid".',
        });
    }

    try {
        const bills = await BillLogs.find({ status });

        if (!bills.length) {
            return res.json({ success: false, message: `No bills found with status "${status}".` });
        }

        res.json({
            success: true,
            bills: bills.map(bill => ({
                bill_id: bill._id,
                flat_number: bill.flat_number,
                status: bill.status,
                date: bill.date || 'N/A',
                time: bill.time || 'N/A',
                utr_number: bill.utr_number || 'N/A',
            })),
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching bill logs' });
    }
});



// Endpoint to fetch all visitor logs
app.get('/getVisitorLogs', async (req, res) => {
    try {
        // Fetch all visitor logs from the 'visitorlogs' collection
        const visitorLogs = await visitorLog.find();

        if (visitorLogs.length === 0) {
            return res.json({ success: false, message: 'No visitor logs found.' });
        }

        res.json({
            success: true,
            visitor_logs: visitorLogs,
        });
    } catch (err) {
        console.error('Error fetching visitor logs:', err); // Log the error
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});



app.get('/api/visitors', async (req, res) => {
    try {
        const visitors = await Visitor.find().sort({ entry_datetime: -1 });
        res.json(visitors);
    } catch (error) {
        console.error('Error fetching visitors:', error);
        res.status(500).json({ error: 'Failed to fetch visitors' });
    }
});

app.get('/api/visitors/date/:date', async (req, res) => {
    try {
        const dateStr = req.params.date;
        const startDate = new Date(dateStr);
        const endDate = new Date(dateStr);
        endDate.setDate(endDate.getDate() + 1);

        const visitors = await Visitor.find({
            entry_datetime: {
                $gte: startDate.toISOString(),
                $lt: endDate.toISOString()
            }
        }).sort({ entry_datetime: -1 });

        res.json(visitors);
    } catch (error) {
        console.error('Error fetching visitors by date:', error);
        res.status(500).json({ error: 'Failed to fetch visitors' });
    }
});

app.post('/api/visitors', async (req, res) => {
    try {
        const visitor = new Visitor(req.body);
        await visitor.save();
        res.status(201).json(visitor);
    } catch (error) {
        console.error('Error creating visitor:', error);
        res.status(400).json({ error: 'Failed to create visitor' });
    }
});

app.put('/api/visitors/checkout/:id', async (req, res) => {
    try {
        const visitor = await Visitor.findByIdAndUpdate(
            req.params.id,
            {
                exit_datetime: req.body.exit_datetime,
                status: 'Completed'
            },
            { new: true }
        );

        if (!visitor) {
            return res.status(404).json({ error: 'Visitor not found' });
        }

        res.json(visitor);
    } catch (error) {
        console.error('Error checking out visitor:', error);
        res.status(500).json({ error: 'Failed to check out visitor' });
    }
});



// Endpoint to get all vacancies
app.get('/api/vacancies', async (req, res) => {
    try {
        const vacancies = await Vacancy.find();
        res.json(vacancies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vacancies' });
    }
});

// Endpoint to add a new vacancy
app.post('/api/vacancies', async (req, res) => {
    const { flat_number, no_of_days_to_be_vacant, reason } = req.body;

    if (!flat_number || !no_of_days_to_be_vacant || !reason) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const newVacancy = new Vacancy({
        flat_number,
        no_of_days_to_be_vacant,
        reason
    });

    try {
        await newVacancy.save();
        res.status(201).json({ message: 'Vacancy added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add vacancy' });
    }
});

// Endpoint to delete a vacancy
app.delete('/api/vacancies/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedVacancy = await Vacancy.findByIdAndDelete(id);

        if (!deletedVacancy) {
            return res.status(404).json({ error: 'Vacancy not found' });
        }

        res.json({ message: 'Vacancy deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete vacancy' });
    }
});



// Fetch all complaint records
app.get('/api/complaint-records', async (req, res) => {
    try {
        const records = await ComplaintRecord.find(); // Fetch all complaint records
        res.json(records); // Return records as JSON
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch complaint records' });
    }
});

// Add a new complaint record
app.post('/api/complaint-records', async (req, res) => {
    const { flat_number, complaint, description } = req.body;

    if (!flat_number || !complaint || !description) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const newRecord = new ComplaintRecord({
        flat_number,
        complaint,
        description
    });

    try {
        await newRecord.save();
        res.status(201).json({ message: 'Complaint record added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add complaint record' });
    }
});

// Update status of a complaint record
app.put('/api/complaint-records/:id/status', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the complaint record by ID and update the status
        const updatedRecord = await ComplaintRecord.findByIdAndUpdate(
            id,
            { status: 'completed' }, // Update status to 'completed'
            { new: true } // Return the updated document
        );

        if (!updatedRecord) {
            return res.status(404).json({ error: 'Complaint record not found' });
        }

        res.json({ message: 'Status updated successfully', record: updatedRecord });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update status' });
    }
});


// Routes
app.get('/api/employees', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const employees = await Employee.find();
        
        // Get today's logs for all employees
        const logs = await Log.find({
            Date: today,
            EmployeeID: { $in: employees.map(e => e.EmployeeID) }
        });

        // Map logs to employees
        const employeesWithLogs = employees.map(emp => {
            const todayLog = logs.find(log => log.EmployeeID === emp.EmployeeID);
            return {
                ...emp.toObject(),
                todayLog
            };
        });

        res.json(employeesWithLogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/checkin', async (req, res) => {
    try {
        const { EmployeeID } = req.body;
        const today = new Date().toISOString().split('T')[0];

        const existingLog = await Log.findOne({
            EmployeeID,
            Date: today
        });

        if (existingLog && existingLog.CheckInTime) {
            return res.status(400).json({ message: 'Already checked in today' });
        }

        if (existingLog) {
            existingLog.CheckInTime = new Date();
            await existingLog.save();
        } else {
            await Log.create({
                EmployeeID,
                Date: today,
                CheckInTime: new Date()
            });
        }

        res.json({ message: 'Check-in successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/checkout', async (req, res) => {
    try {
        const { EmployeeID } = req.body;
        const today = new Date().toISOString().split('T')[0];

        const log = await Log.findOne({
            EmployeeID,
            Date: today
        });

        if (!log || !log.CheckInTime) {
            return res.status(400).json({ message: 'Must check in before checking out' });
        }

        if (log.CheckOutTime) {
            return res.status(400).json({ message: 'Already checked out today' });
        }

        log.CheckOutTime = new Date();
        await log.save();

        res.json({ message: 'Check-out successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
/////////////////////////////////////////////////////////////////////////////////////////////
// PResident attendence view

// Get all employees
app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find().sort('Name');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get logs by date
app.get('/api/logs/date/:date', async (req, res) => {
    try {
        const logs = await Log.find({ Date: req.params.date });
        const employeeIds = logs.map(log => log.EmployeeID);
        const employees = await Employee.find({ EmployeeID: { $in: employeeIds } });

        const logsWithDetails = logs.map(log => ({
            ...log.toObject(),
            employee: employees.find(emp => emp.EmployeeID === log.EmployeeID)
        }));

        res.json(logsWithDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get logs by employee
app.get('/api/logs/employee/:employeeId', async (req, res) => {
    try {
        const logs = await Log.find({ EmployeeID: req.params.employeeId })
            .sort('-Date');
        const employee = await Employee.findOne({ EmployeeID: req.params.employeeId });

        const logsWithDetails = logs.map(log => ({
            ...log.toObject(),
            employee
        }));

        res.json(logsWithDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
///////////////////////////////////////////////////////////////////////////////////////////
// //Email Message sending
import nodemailer from 'nodemailer';

import { MongoClient } from 'mongodb';

// MongoDB connection setup
const mongoUri = 'mongodb://127.0.0.1:27017'; // Replace with your MongoDB URI
const dbName = 'Akshaya_Garden_Apartment_Database'; // Replace with your database name
let client;

// Step 1: Configure the transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '01fe22bcs259@kletech.ac.in', // Your email
        pass: 'swzk lukh byrh xema', // Your email app password
    },
});

// Step 2: Email sending function
const sendReminderEmails = async () => {
    try {
        // Initialize MongoDB client if not already connected
        if (!client) {
            client = new MongoClient(mongoUri, { useUnifiedTopology: true });
            await client.connect();
            console.log('Connected to MongoDB');
        }

        const db = client.db(dbName);

        // Collections
        const flatsCollection = db.collection('flats');
        const ownersCollection = db.collection('owner');
        const billLogsCollection = db.collection('bills_logs');

        console.log('Fetching unpaid bills...');
        // Fetch flats with unpaid bills
        const unpaidBills = await billLogsCollection.find({ status: 'Unpaid' }).toArray();

        if (unpaidBills.length === 0) {
            console.log('No unpaid bills found.');
            return;
        }

        console.log(`Found ${unpaidBills.length} unpaid bills.`);

        for (const bill of unpaidBills) {
            console.log(`Processing bill for flat: ${bill.flat_number}`);
            const flat = await flatsCollection.findOne({ flat_number: bill.flat_number });

            if (!flat) {
                console.error(`Flat not found for flat_number: ${bill.flat_number}`);
                continue;
            }

            // Determine email recipients
            const emails = [];

            // Add tenant email if tenant is residing
            if (!flat.is_owner_residing && flat.tenant_email) {
                emails.push(flat.tenant_email);
                console.log(`Added tenant email: ${flat.tenant_email}`);
            }

            // Add owner email
            const owner = await ownersCollection.findOne({ owner_id: flat.owner_id });
            if (owner && owner.email) {
                emails.push(owner.email);
                console.log(`Added owner email: ${owner.email}`);
            }

            if (emails.length === 0) {
                console.log(`No email recipients for flat ${bill.flat_number}`);
                continue;
            }

            // Send email
            const mailOptions = {
                from: '01fe22bcs259@kletech.ac.in',
                to: emails.join(', '),
                subject: `Maintenance Fee Reminder for Flat ${bill.flat_number}`,
                text: `Dear Resident/Owner,\n\nThis is a friendly reminder to pay the outstanding maintenance fees for Flat ${bill.flat_number}.\n\nDue Date: ${bill.date}\n\nThank you for your prompt attention to this matter.\n\nBest Regards,\nApartment Management Team`,
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error(`Error sending email for Flat ${bill.flat_number}:`, err);
                } else {
                    console.log(`Email sent successfully for Flat ${bill.flat_number}:`, info.response);
                }
            });
        }
    } catch (error) {
        console.error('Error during email reminder process:', error);
    }
};

// Step 3: Send emails every 10 seconds for testing purposes
setInterval(sendReminderEmails, 10000* 10000); // 10 seconds interval


