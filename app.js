const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

// Set view engine and folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    store: new SQLiteStore({ db: 'sessions.sqlite', dir: './database' }),
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: false
}));

// Database
const db = new sqlite3.Database('./database/database.db');
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)`);

// Routes
app.get('/', (req, res) => res.render('index', { user: req.session.user }));

// Signup
app.get('/signup', (req, res) => res.render('signup'));
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], function(err){
        if(err) return res.send('Username already exists!');
        res.redirect('/login');
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    console.log("Login attempt:", username); // DEBUG

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {

        if (err) {
            console.error("DB ERROR:", err); // DEBUG
            return res.status(500).send("Database error occurred");
        }

        if (!user) {
            console.log("User not found"); // DEBUG
            return res.send("User not found!");
        }

        try {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                console.log("Login success:", username); // DEBUG
                req.session.user = user;
                return res.redirect('/dashboard');
            } else {
                console.log("Incorrect password"); // DEBUG
                return res.send("Incorrect password!");
            }
        } catch (error) {
            console.error("COMPARE ERROR:", error); // DEBUG
            return res.status(500).send("Error comparing passwords");
        }
    });
});


// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Dashboard
app.get('/dashboard', (req, res) => {
    if(!req.session.user) return res.redirect('/login');
    res.render('dashboard', { user: req.session.user });
});

// About
app.get('/about', (req, res) => res.render('about', { user: req.session.user }));

// Profile
app.get('/profile', (req, res) => {
    if(!req.session.user) return res.redirect('/login');
    res.render('profile', { user: req.session.user });
});

// Start server
app.listen(process.env.PORT || 3000, () => console.log('Server running'));
