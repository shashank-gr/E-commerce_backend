const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");

const Product = require("./models/product");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");
``;
// db.execute("SELECT * FROM products").then().catch();
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user; //here adding **sequelize user** to the request
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

//defining Association between models
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" }); //options added to user table, if user is deleted, then products is deleted
User.hasMany(Product);

sequelize
  .sync()
  .then((res) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Shashank", email: "shashank@gmail.com" });
    } else {
      return user;
    }
  })
  .then((user) => {
    // console.log(user.dataValues);
    app.listen(3000);
  })
  .catch((err) => console.log(err));
