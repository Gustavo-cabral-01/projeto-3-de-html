const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));


let users = [];
let userFilms = {};


app.get('/', (req, res) => {
    res.render('login');
});


app.get('/register', (req, res) => {
    res.render('register');
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.redirect(`/filmes?email=${encodeURIComponent(email)}`);
    } else {
        res.status(401).send('Email ou senha inválidos!');
    }
});


app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send('Preencha todos os campos!');
    }

    const userExists = users.some(u => u.email === email);
    if (userExists) {
        return res.status(409).send('O Usuário já Foi registrado!');
    }

    users.push({ name, email, password });
    userFilms[email] = [];
    res.redirect('/');
});


app.get('/filmes', (req, res) => {
    const email = req.query.email;
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).send('Usuário não encontrado!');
    }

    res.render('filmes', { user, filmes: userFilms[email] });
});


app.post('/filmes', (req, res) => {
    const { email, title, cover } = req.body;

    if (!userFilms[email]) {
        return res.status(404).send('Usuário não encontrado!');
    }

    userFilms[email].push({ title, cover });
    res.redirect(`/filmes?email=${encodeURIComponent(email)}`);
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
