// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const breakfastRouter = require("./routes/breakfastRouter");

// const app = express();
// const PORT = process.env.PORT || 4000;

// app.use(express.json());
// app.use("/api/v1/breakfast", breakfastRouter);

// mongoose.connect(process.env.DB_URI)
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("DB connection error:", err.message);
//   });

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const breakfastRouter = require("./routes/breakfastRouter");
const app = express();
const port = process.env.PORT || 3000;
const dbURI = process.env.DB_URI;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", breakfastRouter);


// Connect to MongoDB
mongoose.connect(dbURI)
    .then(() => console.log('MongoDB connected'),
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        }))
    .catch((error) => {console.log(error.message)});