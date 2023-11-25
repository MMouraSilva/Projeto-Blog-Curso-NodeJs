const express = require("express");
const router = express.Router();
const User = require("./User");
const Category = require("../categories/Category");
const bcrypt = require("bcryptjs");

router.get("/admin/users", (req, res) => {
  User.findAll().then(users => {
    res.render("admin/users/index", { users });
  });
});

router.get("/admin/users/create", (req, res) => {
  Category.findAll().then(categories => {
    res.render("admin/users/create", { categories });
  });
});

router.post("/users/create", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({ where: { email } }).then(user => {
    if(!user) {
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(password, salt);
    
      User.create({
        email,
        password: hash
      }).then(() => {
        res.redirect("/admin/users");
      }).catch((err) => {
        res.redirect("/");
      });
    } else {
      res.redirect("/admin/users/create");
    };
  });
});

router.post("/users/delete", (req, res) => {
  var id = req.body.id;

  if(id && !isNaN(id)) {
      User.destroy({
          where: {
              id
          }
      }).then(() => {
          res.redirect("/admin/users");
      });
  } else {
      res.redirect("/admin/users");
  }
});

router.get("/admin/users/edit/:id", (req, res) => {
  var id =  req.params.id;

  User.findByPk(id).then(user => {
      if(user) {
          res.render("admin/users/edit", { user })
      } else {
          res.redirect("/admin/users");
      }
  }).catch(erro => {
      res.redirect("/admin/users");
  });
});

router.post("/users/update", (req, res) => {
  var id = req.body.id;
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({ where: { email } }).then(user => {
    if(!user || (user && user.dataValues.id == id)) {
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(password, salt);

      if(password) {
        User.update({ email, password: hash }, {
            where: {
                id
            }
        }).then(() => {
            res.redirect("/admin/users");
        });      
      } else {
        User.update({ email }, {
          where: {
              id
            }
        }).then(() => {
            res.redirect("/admin/users");
        }); 
      }
    } else {
      res.redirect("/admin/users/edit/" + id);
    };
  });
});

router.get("/login", (req, res) => {
  res.render("admin/users/login");
});

router.post("/authenticate", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({
    where: {
      email
    }
  }).then(user => {
    if(user) {
      // Validar senha
      var correct = bcrypt.compareSync(password, user.password);

      if(correct) {
        req.session.user = {
          id: user.id,
          email: user.email
        }
        res.redirect("/admin/articles");
      } else {
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.user = undefined;
  res.redirect("/");
});

module.exports = router;