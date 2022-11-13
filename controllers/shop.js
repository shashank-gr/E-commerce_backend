const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(([rows, metaData]) => {
    res.render("shop/product-list", {
      prods: rows,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProductDetails = (req, res) => {
  const prodId = req.params.productId;
  Product.fetchById(prodId)
    .then(([row, metaData]) => {
      const product = row[0];
      res.render("shop/product-detail", {
        prod: product,
        title: product.title,
        imageUrl: product.imageUrl,
        price: product.price,
        description: product.description,
        pageTitle: "product Description",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll().then(([rows, metaData]) => {
    res.render("shop/index", {
      prods: rows,
      pageTitle: "Shop",
      path: "/",
    });
  });
};
exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  Product.fetchProductById(prodId, (product) => {
    Cart.addCart(prodId, product.price);
  });
  res.redirect("/cart");
};

exports.getCart = (req, res, next) => {
  res.redirect("/");
  // Cart.fetchAllFromCart((cartProducts) => {
  //   res.render("shop/cart", {
  //     cartProds: cartProducts,
  //     path: "/cart",
  //     pageTitle: "Your Cart",
  //   });
  // });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
