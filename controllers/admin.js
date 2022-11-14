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
  if (prodId) {
    Product.update(
      {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
      },
      {
        where: { id: prodId },
      }
    ).then(() => {
      res.redirect("/admin/products");
    });
  } else {
    Product.create({
      title,
      imageUrl,
      price,
      description,
    })
      .then((result) => {
        console.log(result);
        res.redirect("/admin/products");
      })
      .catch((err) => console.log(err));
  }
};

exports.postEditProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId).then((product) => {
    res.render("admin/edit-product", {
      prod: product,
      path: "",
      pageTitle: "Edit Product",
    });
  });
  // console.log(req.query.edit);
  // Product.fetchById(prodId).then(([row, metaData]) => {
  //   res.render("admin/edit-product", {
  //     prod: row[0],
  //     path: "",
  //     pageTitle: "Edit Product",
  //   });
  // });
};

exports.postDeleteProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.destroy({ where: { id: prodId } }).then(() => {
    res.redirect("/admin/products");
  });
};
exports.getProducts = (req, res, next) => {
  Product.findAll().then((products) => {
    // console.log(products);
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};
