const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { resolve } = require('path');
const authRoutes = require('./routes/auth');
const pageRoutes = require('./routes/pages');
const { Strategy } = require('passport-local');
const LocalStrategy = require('passport-local').Strategy;
const passport= require('passport');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/', pageRoutes);

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.use(passport.initialize());
passport.use('local',new LocalStrategy({passReqToCallback: true},
  (req, username, password, done) => {
    console.log(`Local Strategy verify cb`);
    return done(null, {id:"test"});
  },
))