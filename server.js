require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const menuRouter= require("./routes/menuRouterr")
const app = express();
const port = process.env.PORT || 3000;
const dbURI = process.env.DB_URI;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1',menuRouter)


// Connect to MongoDB
mongoose.connect(dbURI)
    .then(() => console.log('MongoDB connected'),
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        }))
    .catch((error) => {console.log(error.message)});