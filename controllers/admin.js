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
    req.user
      .createProduct({
        //createProduct is a special sequilezed function now association is defined
        title,
        imageUrl,
        price,
        description,
      })
      .then((user) => {
        console.log(user);
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
  }
};

exports.postEditProduct = (req, res) => {
  const prodId = req.params.productId;
  req.user.getProducts({ where: { id: prodId } }).then((products) => {
    const product = products[0];
    res.render("admin/edit-product", {
      prod: product,
      path: "",
      pageTitle: "Edit Product",
    });
  });
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
