// Import required packages
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // For hashing and comparing passwords
const cors = require('cors');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json()); // To parse JSON request bodies
app.use(cors()); // To allow cross-origin requests

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((error) => console.error("Error connecting to MongoDB Atlas:", error));

// User Schema and Model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        // Find the user in the database
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        // Send success response
        res.status(200).json({ message: 'Login successful!' });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: 'An error occurred during login.' });
    }
});

// Start Server
app.listen(process.env.PORT || PORT, () => {
  console.log("REST API is listening.");
});