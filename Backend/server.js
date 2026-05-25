// Import dotenv and config in one line no need of creating extra variable
require("dotenv").config();

// Import routes
const passRoutes = require('./Routes/passRoutes');
const visitorRoutes = require('./Routes/visitorRoutes');
const authRoutes = require("./Routes/authRoutes");
const checkRoutes = require("./Routes/checkRoutes");
const reportRoutes = require('./Routes/reportRoutes');
const appointmentsRoutes = require('./Routes/apointmentRoutes');

// Import express, cors and morgan for method logs
const express = require("express");
const cors = require("cors");
const morgan  = require('morgan');

// Import dbconnection from config folder where we have setuped the connection
const DBconnection = require("./Config/db");
const { testEmail } = require("./Utils/sendEmail");

// Use express by app variable
const app = express();

// Connect to database by this method
DBconnection();

// Allow backend to read JSON body
app.use(express.json());

// Log every request
app.use(morgan('dev'));

// Allow frontend to access backend
app.use(cors({ origin: `http://localhost:5173` }));

// Test route
app.get("/", (req, res) => {
    console.log("ROOT HIT");
    res.send("Server working");
});

app.use('/uploads', express.static('uploads'));

// Test email setup
app.get('/test-email', async (req, res) => {
    try {
        await testEmail();

        res.json({
        message: 'Email sent successfully'
        });
    } catch (err) {
        res.status(500).json({
        message: err.message
        });
    }
});

//Routes for auth, visitor, checklogs, reports, apointments and passes
app.use('/api/auth', authRoutes);

app.use('/api/appointments', appointmentsRoutes);

app.use('/api/visitors', visitorRoutes);

app.use('/api/passes', passRoutes);

app.use('/api/check', checkRoutes);

app.use('/api/reports', reportRoutes);


// Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 2004;

// starting server by port which is imported from .env file
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});