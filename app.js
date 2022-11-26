const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// console.log(process.env);
const errorController = require("./controllers/error");
const sequelize = require("./util/database");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

// db.execute("SELECT * FROM products").then().catch();
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
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
//for front end deployment
app.use((req, res) => {
  console.log(req.url); // to get the url
  res.sendFile(path.join(__dirname, "frontend", `${req.url}`));
});
app.use(errorController.get404);

//defining Association between user and product (one to many)
//define options in first association or both
User.hasMany(Product, { constraints: true, onDelete: "CASCADE" }); //options added to user table, if user is deleted, then products is deleted
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
//define association b/w user and cart (one to one)
User.hasOne(Cart);
Cart.belongsTo(User);
//define association between product and cart (many to many)
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
//one to many b/w user and order
User.hasMany(Order);
Order.belongsTo(User);
//many to many b/w orders and products
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize
  .sync()
  .then((res) => {
    return User.findOrCreate({
      where: { id: 1 },
      defaults: { name: "Shashanka", email: "shashank@gmail.com" },
    });
  })
  .then((user) => {
    // console.log(user[0].dataValues);
    return Cart.findOrCreate({ where: { userId: 1 }, defaults: {} });
    // return user.createCart();
  })
  .then((cart) => {
    // console.log(cart[0].dataValues);
    app.listen(3000);
  })
  .catch((err) => console.log(err));
