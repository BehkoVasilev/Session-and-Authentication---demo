const express = require('express');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');


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
            <input type="password" id="repassword" name="password">

            <input type="submit" value="login" >
        </form>`
    );
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username == 'Ivan' && password == 'peti') {
        const authData = {
            username: 'Ivan',

        };

        res.cookie('auth', JSON.stringify(authData));
        req.session.username = 'Test1';
        req.session.privetInfo = "some privet info";
        return res.redirect('/')
    };
    res.status(401).end()
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

            <label for="password">Repassword</label>
            <input type="password" id="password" name="password">

            <input type="submit" value="register" >
        </form>`
    );
});

app.listen(5000, () => console.log("Server is running on port 5000..."));