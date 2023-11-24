const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const connection = require("./database/database");

const categoriesController = require("./categories/categoriesController");
const articlesController = require("./articles/articlesController");
const usersController = require("./users/usersController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

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

app.use("/", usersController);

app.get("/", async (req, res) => {
    try {
        Article.findAll({
            order: [
                ["id", "desc"]
            ],
            limit: 4
        }).then(articles => {
            Category.findAll().then(categories => {
                res.render('index', { articles, categories });
            });
        });
    } catch (error) {
        console.error('Erro na rota:', error);
        res.status(500).send('Erro ao executar a rota');
    }
});

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug
        }
    }).then(article => {
        if(article) {
            Category.findAll().then(categories => {
                res.render('article', { article, categories });
            });
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })
});

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;

    Category.findOne({
        where: {
            slug
        },
        include: [{ model: Article }]
    }).then(category => {
        if(category) {
            Category.findAll().then(categories => {
                res.render("index", { articles: category.articles, categories });
            });
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

http.listen(8000, () => {
    console.log('App rodando!');
});