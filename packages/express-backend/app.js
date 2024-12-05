import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Setup __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Check for required environment variables
if (!process.env.MONGODB_URI || !process.env.TOKEN_SECRET) {
    console.error("MONGODB_URI or TOKEN_SECRET is undefined. Ensure your .env file is configured.");
    process.exit(1); // Exit if required env variables are missing
}


console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("TOKEN_SECRET:", process.env.TOKEN_SECRET);


// Initialize Express
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Allow cross-origin requests

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI, { dbName: 'sloutions' })
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(error => {
        console.error("Error connecting to MongoDB Atlas:", error);
        process.exit(1); // Exit if MongoDB connection fails
    });

// User schema for authentication
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// Report schema for issue reporting
const reportSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    status: { type: String, default: "unresolved" },
});
const Report = mongoose.model("Report", reportSchema);

// Token validation middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Authorization Header:', authHeader); // Debug
    console.log('Extracted Token:', token); // Debug

    if (!token) {
        return res.status(401).json({ success: false, error: "Unauthorized: Token missing" });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error('JWT Error:', err); // Debug
            return res.status(403).json({ success: false, error: "Forbidden: Invalid token" });
        }

        req.user = user;
        next();
    });
}




app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        // Attempt a database query
        await mongoose.connection.db.admin().ping();
        res.status(200).send('Healthy');
    } catch (error) {
        res.status(500).send('Unhealthy: Database connection failed');
    }
});


// Register new user (Optional)
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Failed to register user" });
    }
});

// GET /login
app.get('/login', authenticateToken, async (req, res) => {
    try {
        // Fetch all users
        const users = await User.find({}); 
        res.status(200).json(users); // Return the user list
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// Login user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: "Invalid username or password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: "Invalid username or password",
            });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.TOKEN_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Allow anyone to submit a report
app.post("/api/reports", async (req, res) => {
    try {
        const report = new Report(req.body); // Create a new report object
        const savedReport = await report.save(); // Save to MongoDB
        res.status(201).json(savedReport); // Send the full saved report back to the frontend
    } catch (error) {
        console.error("Error saving report:", error);
        res.status(500).json({ message: "Failed to save report" });
    }
});

// Fetch a single report by ID
app.get('/api/reports/:id', async (req, res) => {
    const { id } = req.params; // Extract the ID from the URL
    try {
        const report = await Report.findById(id); // Query the database for the report
        if (!report) {
            return res.status(404).json({ message: 'Report not found' }); // Return 404 if not found
        }
        res.status(200).json(report); // Return the report if found
    } catch (error) {
        console.error("Error fetching report by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Update a report's status
app.patch('/api/reports/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['unresolved', 'pending', 'resolved'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
    }

    try {
        // Find the report by ID and update its status
        const updatedReport = await Report.findByIdAndUpdate(
            id,
            { status },
            { new: true } // Return the updated document
        );

        if (!updatedReport) {
            return res.status(404).json({ error: "Report not found" });
        }

        res.status(200).json(updatedReport);
    } catch (error) {
        console.error("Error updating report status:", error);
        res.status(500).json({ error: "Failed to update report status" });
    }
});


// Fetch all reports (protected)
// Fetch all reports with advanced filters
app.get('/api/reports', authenticateToken, async (req, res) => {
    try {
        // Extract query parameters
        const { id, title, description, status, location, startDate, endDate, limit, page } = req.query;

        // Build the MongoDB query object dynamically
        const query = {};

        if (id) {
            // Filter by exact ID
            query._id = id;
        }

        if (title) {
            // Partial, case-insensitive match for title
            query.title = new RegExp(title, 'i');
        }

        if (description) {
            // Partial, case-insensitive match for description
            query.description = new RegExp(description, 'i');
        }

        if (status) {
            query.status = status; // Exact match for status
        }

        if (location) {
            query.location = new RegExp(location, 'i'); // Case-insensitive partial match
        }

        if (startDate || endDate) {
            query.createdDate = {};
            if (startDate) {
                query.createdDate.$gte = new Date(startDate); // Greater than or equal to startDate
            }
            if (endDate) {
                query.createdDate.$lte = new Date(endDate); // Less than or equal to endDate
            }
        }

        // Pagination: Set default limit and page if not provided
        const itemsPerPage = parseInt(limit, 10) || 10; // Default limit: 10
        const currentPage = parseInt(page, 10) || 1; // Default page: 1
        const skip = (currentPage - 1) * itemsPerPage;

        // Fetch filtered and paginated reports
        const reports = await Report.find(query)
            .skip(skip) // Skip documents for pagination
            .limit(itemsPerPage); // Limit the number of documents

        // Count total documents for pagination metadata
        const totalReports = await Report.countDocuments(query);

        // Send response
        res.status(200).json({
            currentPage,
            totalPages: Math.ceil(totalReports / itemsPerPage),
            totalReports,
            reports,
        });
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ error: "Failed to fetch reports" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
