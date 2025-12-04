const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express(); // <-- MUST come BEFORE app.set

// Set view engine and folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false
}));

// Database
const db = new sqlite3.Database('./database.db');
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)`);

// Routes
app.get('/', (req, res) => res.render('index', { user: req.session.user }));

app.get('/signup', (req, res) => res.render('signup'));
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], function(err){
        if(err) return res.send('Username already exists!');
        res.redirect('/login');
    });
});

app.get('/login', (req, res) => res.render('login'));
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if(!user) return res.send('User not found!');
        if(await bcrypt.compare(password, user.password)){
            req.session.user = user;
            res.redirect('/dashboard');
        } else {
            res.send('Incorrect password!');
        }
    });
});

app.get('/dashboard', (req, res) => {
    if(!req.session.user) return res.redirect('/login');
    res.render('dashboard', { user: req.session.user });
});

// New pages/routes

// About page (accessible to everyone)
app.get('/about', (req, res) => {
    res.render('about', { user: req.session.user });
});

// Profile page (only for logged-in users)
app.get('/profile', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('profile', { user: req.session.user });
});


app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});



// Start server
app.listen(process.env.PORT || 3000, () => console.log('Server running'));

