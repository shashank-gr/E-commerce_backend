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
    product.save();
    res.redirect("/");
  } else {
    const product = new Product(null, title, imageUrl, description, price);
    product.save();
    res.redirect("/");
  }
};

exports.postEditProduct = (req, res) => {
  const prodId = req.params.productId;
  console.log(req.query.edit);
  Product.fetchProductById(prodId, (product) => {
    res.render("admin/edit-product", {
      prod: product,
      path: "",
      pageTitle: "Edit Product",
    });
  });
};

exports.postDeleteProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.deleteProductByid(prodId, () => {
    res.redirect("/");
  });
};
exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};
