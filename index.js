const express = require('express');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dataService = require('./dataService');

const app = express();

app.use(express.urlencoded({ extended: false }));
//long-term
app.use(cookieParser());
//short-term
app.use(expressSession({
    secret: 'keybort cat',
    resave: false,
    saveUninitialized: true,
    cookie: false
}))

app.get('/', (req, res) => {
    res.send(`
        <h1>Hello Cookie</h1>
        <ul>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/register">Register</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/logout">Logout</a></li>
        </ul>`
    );
});

app.get("/login", (req, res) => {
    res.send(`
        <h1>Sing in</h1>
        <form method="POST">
            <label for="username">Username</label>
            <input type="text" id="username" name="username">
    
            <label for="password">Password</label>
            <input type="password" id="password" name="password">

            <input type="submit" value="login" >
        </form>`
    );
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await dataService.loginUser(username, password);
        const authData = {
            username: user.username,
        };

        res.cookie('auth', JSON.stringify(authData));
        req.session.username = user.username;
        req.session.privetInfo = user.password;

        return res.redirect('/')
    } catch {
        res.status(401).end();
    }
});

app.get('/profile', (req, res) => {
    const authData = req.cookies['auth'];

    if (!authData) {
        return res.redirect('/login');
    }

    const { username } = JSON.parse(authData);
    console.log(req.session);
    console.log(username);

    res.send(`<h2> Hello - ${username}</h2>`)
});

app.get("/register", (req, res) => {
    res.send(`
        <h1>Sing up</h1>
        <form method="POST">
            <label for="username">Username</label>
            <input type="text" id="username" name="username">
    
            <label for="password">Password</label>
            <input type="password" id="password" name="password">

            <input type="submit" value="register" >
        </form>`
    );
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    await dataService.registerUser(username, password);

    res.redirect('/login');
});

app.get('/logout', (req, res) =>{
    res.clearCookie('auth');
    res.redirect('/');
});



app.listen(5000, () => console.log("Server is running on port 5000..."));