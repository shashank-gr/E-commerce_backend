const Product = require("../models/product");
const Cart = require("../models/cart");
const CartItem = require("../models/cart-item");

exports.getProducts = (req, res, next) => {
  Product.findAll().then((products) => {
    // console.log(products);
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProductDetails = (req, res) => {
  const prodId = req.params.productId;
  req.user
    .getProducts({ where: { id: prodId } })
    .then((products) => {
      // console.log(products);
      res.render("shop/product-detail", {
        product: products[0],
        pageTitle: products[0].title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll().then((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};
exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  //get the user cart
  //check if cart already has the product if yes increase quanity
  //if not add the product to the cart and set quantity to 1
  let userCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      userCart = cart;
      return userCart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      if (products.length > 0) {
        const product = products[0];
        newQuantity = product.cartItem.quantity + 1;
        return product;
        // return userCart.addProduct(product, { through: { quantity: newQuantity } });
        // console.log("product", product);
      } else {
        return Product.findByPk(prodId);
      }
    })
    .then((product) => {
      return userCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then((userCartProducts) => {
      res.redirect("/cart");
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart() //user to cart -->one to one
    .then((cart) => {
      // console.log(cart);
      return cart.getProducts(); //cart to product---->many to many; here user.cart to product--->one to many
    })
    .then((cartProducts) => {
      // console.log(cartProducts);
      res.render("shop/cart", {
        products: cartProducts,
        path: "/cart",
        pageTitle: "Your Cart",
      });
    });
};

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((userCart) => {
      return userCart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      return products[0].cartItem.destroy();
    })
    .then((result) => {
      console.log("destroyed");
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
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
