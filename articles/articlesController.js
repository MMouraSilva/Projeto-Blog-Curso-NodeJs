const express = require("express");
const router = express.Router();
const Article = require("./Article");
const Category = require("../categories/Category");
const slugify = require("slugify");

router.get("/admin/articles", (req, res) => {
    Article.findAll({
        include: [{ model: Category }]
    }).then(articles => {
        res.render("admin/articles/index", { articles });
    });
});

router.get("/admin/articles/new", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", { categories });
    })
});

router.post("/articles/save", (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title,
        slug: slugify(title),
        body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles");
    });
});

router.post("/articles/delete", (req, res) => {
    var id = req.body.id;

    if(id && !isNaN(id)) {
        Article.destroy({
            where: {
                id
            }
        }).then(() => {
            res.redirect("/admin/articles");
        });
    } else {
        res.redirect("/admin/articles");
    }
});

router.get("/admin/articles/edit/:id", (req, res) => {
    var id = req.params.id;

    Article.findByPk(id).then(article => {
        if(article) {
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", { categories, article });
            })
        } else {
            res.redirect("/");    
        }
    }).catch(err => {
        res.redirect("/");
    });
});

router.post("/articles/update", (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.update({ title, body, categoryId: category, slug: slugify(title) }, {
        where: {
            id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(err => {
        res.redirect("/");
    });
});

module.exports = router;