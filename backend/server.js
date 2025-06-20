const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON request bodies

// --- Mock Data Store ---
let users = [
  { id: 1, email: 'admin@example.com', password: 'adminpassword', role: 'administrator', firstName: 'Admin', lastName: 'User' },
  { id: 2, email: 'resident@example.com', password: 'residentpassword', role: 'resident', firstName: 'Resident', lastName: 'User' },
];
let complaints = [
  { id: 1, userId: 2, title: 'Leaky Faucet', description: 'The faucet in the kitchen is leaking.', status: 'Open', dateSubmitted: '2024-01-15' },
  { id: 2, userId: 2, title: 'Broken Streetlight', description: 'Streetlight outside building C is out.', status: 'In Progress', dateSubmitted: '2024-01-20' },
];
let announcements = [
  { id: 1, title: 'Community BBQ Next Weekend!', content: 'Join us for a community BBQ on Saturday at 2 PM in the common park area.', datePosted: '2024-03-01' },
  { id: 2, title: 'Pool Maintenance', content: 'The community pool will be closed for maintenance on March 5th.', datePosted: '2024-03-02' },
];
let payments = [];
let nextUserId = 3;
let nextComplaintId = 3;
let nextPaymentId = 1;

// --- Routes ---

// Root
app.get('/', (req, res) => {
  res.send('Community Connect Mock Backend is running!');
});

// Auth Routes
app.post('/api/auth/login', (req, res) => {
  const { email, password, userType } = req.body;
  const user = users.find(u => u.email === email && u.password === password && u.role === userType);
  if (user) {
    // In a real app, send a JWT token
    res.json({ message: 'Login successful', user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName } });
  } else {
    res.status(401).json({ message: 'Invalid credentials or user type' });
  }
});

app.post('/api/auth/signup', (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ message: 'User already exists with this email' });
  }
  const newUser = {
    id: nextUserId++,
    email,
    password, // In a real app, hash this password
    firstName,
    lastName,
    role: 'resident' // Default role for signup
  };
  users.push(newUser);
  res.status(201).json({ message: 'User registered successfully', user: {id: newUser.id, email: newUser.email, role: newUser.role, firstName: newUser.firstName, lastName: newUser.lastName } });
});

// User Routes (Admin)
app.get('/api/users', (req, res) => {
  // In a real app, protect this route for admins only
  res.json(users.map(u => ({ id: u.id, email: u.email, role: u.role, firstName: u.firstName, lastName: u.lastName })));
});

app.post('/api/users', (req, res) => {
  // Admin creating a new user
  const { email, password, firstName, lastName, role } = req.body;
   if (!email || !password || !firstName || !lastName || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ message: 'User already exists with this email' });
  }
  const newUser = { id: nextUserId++, email, password, firstName, lastName, role };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Complaint Routes
app.get('/api/complaints', (req, res) => {
  // Could be filtered by userId for residents, or all for admin
  res.json(complaints);
});

app.post('/api/complaints', (req, res) => {
  const { userId, title, description } = req.body;
  if(!userId || !title || !description) {
    return res.status(400).json({message: "User ID, title and description are required."})
  }
  const newComplaint = {
    id: nextComplaintId++,
    userId,
    title,
    description,
    status: 'Open',
    dateSubmitted: new Date().toISOString().split('T')[0]
  };
  complaints.push(newComplaint);
  res.status(201).json(newComplaint);
});

app.put('/api/complaints/:id', (req, res) => {
  const complaintId = parseInt(req.params.id);
  const { status } = req.body;
  const complaint = complaints.find(c => c.id === complaintId);
  if (complaint) {
    complaint.status = status || complaint.status;
    res.json(complaint);
  } else {
    res.status(404).json({ message: 'Complaint not found' });
  }
});

// Announcement Routes
app.get('/api/announcements', (req, res) => {
  res.json(announcements);
});

// Payment Routes
app.post('/api/payments', (req, res) => {
  const { userId, amount, details } = req.body;
   if(!userId || !amount || !details) {
    return res.status(400).json({message: "User ID, amount and details are required."})
  }
  const newPayment = {
    id: nextPaymentId++,
    userId,
    amount,
    details,
    paymentDate: new Date().toISOString().split('T')[0],
    status: 'Completed' // Mock status
  };
  payments.push(newPayment);
  res.status(201).json(newPayment);
});


// Start server
app.listen(PORT, () => {
  console.log(\`Mock backend server is running on http://localhost:\${PORT}\`);
});
