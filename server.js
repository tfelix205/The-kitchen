require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const menuRouter= require("./routes/menuRouterr")
const app = express();
const port = process.env.PORT || 3000;
const dbURI = process.env.DB_URI;
const userRoutes = require('./routes/userRoutes.js');



// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1',menuRouter)


// Routes
app.use('/api/users', userRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to Risebite API');
});



// Connect to MongoDB
mongoose.connect(dbURI)
    .then(() => console.log('database  connected'),
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        }))
    .catch((error) => {console.log(error.message)});