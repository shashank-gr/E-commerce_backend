const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  console.log(req.body);
  if (prodId) {
    const product = new Product(prodId, title, imageUrl, description, price);
    product.save().then(() => {
      res.redirect("/");
    });
  } else {
    const product = new Product(null, title, imageUrl, description, price);
    product
      .save()
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => console.log(err));
  }
};

exports.postEditProduct = (req, res) => {
  const prodId = req.params.productId;
  console.log(req.query.edit);
  Product.fetchById(prodId).then(([row, metaData]) => {
    res.render("admin/edit-product", {
      prod: row[0],
      path: "",
      pageTitle: "Edit Product",
    });
  });
};

exports.postDeleteProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.deleteById(prodId).then(() => {
    res.redirect("/");
  });
};
exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(([row, metaData]) => {
    res.render("admin/products", {
      prods: row,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};
