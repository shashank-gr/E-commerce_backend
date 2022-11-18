const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  req.user
    .createProduct({
      //createProduct is a special sequilezed function now association is defined
      title,
      imageUrl,
      price,
      description,
    })
    .then((product) => {
      // console.log(product);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));

  //standard way of setting foreign key in Product table
  //   Product.create({
  //     title,
  //     imageUrl,
  //     price,
  //     description,
  //     userId: req.user.id, //adding to the foreign key
  //   })
  //     .then((result) => {
  //       // console.log(result);
  //       res.redirect("/admin/products");
  //     })
  //     .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res) => {
  console.log(req.body);
  const prodId = req.params.productId;
  req.user.getProducts({ where: { id: prodId } }).then((products) => {
    const product = products[0];
    console.log("product to be editted------------>", product.dataValues);
    res.render("admin/edit-product", {
      product: product,
      path: "",
      pageTitle: "Edit Product",
      editing: true,
    });
  });
};
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then((result) => {
      // console.log("UPDATED PRODUCT!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
exports.postDeleteProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.destroy({ where: { id: prodId } }).then(() => {
    res.redirect("/admin/products");
  });
};
exports.getProducts = (req, res, next) => {
  req.user.getProducts().then((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};
