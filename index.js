const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const connection = require("./database/database");

const categoriesController = require("./categories/categoriesController");
const articlesController = require("./articles/articlesController");

// Indicando para o Express utilizar o EJS como View Engine
app.set('view engine', 'ejs');

// Static
app.use(express.static('public'));

// Importando Body Parser, lib para ler as informações enviadas pelo POST
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso!");
    }).catch((error) => {
        console.log(error);
    })

app.use("/", categoriesController);

app.use("/", articlesController);

app.get('/', async (req, res) => {
    try {
        res.render('index');
    } catch (error) {
        console.error('Erro na rota:', error);
        res.status(500).send('Erro ao executar a rota');
    }
});

http.listen(8000, () => {
    console.log('App rodando!');
});