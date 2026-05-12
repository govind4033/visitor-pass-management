// import dotenv and config in one line no need of creating extra variable
require("dotenv").config();

// import express, cors and morgan for method logs
const express = require("express");
const cors = require("cors");
const morgan  = require('morgan');

// import dbconnection from config folder where we have setuped the connection
const DBconnection = require("./Config/db");

// use express by app variable
const app = express();

// connect to database by this method
DBconnection();

// allow backend to read JSON body
app.use(express.json());

// log every request
app.use(morgan('dev'));

const PORT = process.env.PORT;

// allow frontend to access backend
app.use(cors({ origin: `http://localhost:${PORT}` }));

// test route
app.get("/", (req, res) => {
    res.send("Server working");
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

// starting server by port which is imported from .env file
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});