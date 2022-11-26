const Product = require("../models/product");
const Cart = require("../models/cart");
const CartItem = require("../models/cart-item");
const Order = require("../models/order");
const OrderItem = require("../models/order-item");

const { response } = require("express");
const User = require("../models/user");

const NUMBER_OF_PRODUCTS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
  // console.log(req.query);
  const page = +req.query.page || 1;
  let totalProducts;
  // Product.count().then((numberOfProducts) => {
  //   totalProducts = numberOfProducts;
  //   console.log(totalProducts);
  // });

  Product.findAndCountAll({
    limit: NUMBER_OF_PRODUCTS_PER_PAGE,
    offset: (page - 1) * NUMBER_OF_PRODUCTS_PER_PAGE,
  })
    .then(({ count, rows: products }) => {
      // console.log(count);
      // console.log(products);
      // console.log(page);
      const pagination = {
        currentPage: page,
        hasNextPage: count - page * NUMBER_OF_PRODUCTS_PER_PAGE > 0,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(count / NUMBER_OF_PRODUCTS_PER_PAGE),
      };
      res.status(200).send({
        products,
        pagination,
        msg: "sucess, fetched all products from DB",
      });
    })
    .catch((err) => console.log(err));

  // Product.findAll().then((products) => {
  //   res
  //     .status(200)
  //     .send({ products, msg: "sucess, fetched all products from DB" });
  // });
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
  // console.log(prodId);
  //get the user cart
  //check if cart already has the product if yes increase quanity
  //if not add the product to the cart and set quantity to 1
  let userCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      userCart = cart;
      return Product.findByPk(prodId);
      // return userCart.getProducts({ where: { id: prodId } });
    })
    // .then((products) => {
    //   if (products.length > 0) {
    //     const product = products[0];
    //     newQuantity = product.cartItem.quantity + 1;
    //     return product;
    //     // return userCart.addProduct(product, { through: { quantity: newQuantity } });
    //     // console.log("product", product);
    //   } else {
    //     return Product.findByPk(prodId);
    //   }
    // })
    .then((product) => {
      return userCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then((ans) => {
      res.status(200).send({ msg: "added to cart" });
    })
    .catch((err) => {
      console.log(err);
      response.status(500).send({ msg: "can't add to cart" });
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
      res.status(200).json(cartProducts);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ msg: "internal server 500 error" });
    });
};

exports.postUpdateCart = (req, res) => {
  const cartItemId = req.body.cartItemId;
  const quantity = req.body.quantity;
  CartItem.update({ quantity: quantity }, { where: { id: cartItemId } })
    .then((ans) => {
      console.log(ans);
      res.status(200).send({ msg: "updated cart" });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProductFromCart = (req, res) => {
  const cartItemId = req.body.cartItemId;
  CartItem.destroy({ where: { id: cartItemId } })
    .then((result) => {
      console.log(result);
      if (result == 1) {
        res.status(200).send({ msg: "sucessfully deleted from cart" });
      } else {
        res.status(400).send({ msg: "wrong Cart Item ID provided" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ msg: "Internal server error" });
    });
  // req.user
  //   .getCart()
  //   .then((userCart) => {
  //     return userCart.getProducts({ where: { id: prodId } });
  //   })
  //   .then((products) => {
  //     return products[0].cartItem.destroy();
  //   })
  //   .then((result) => {
  //     console.log("destroyed");
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => console.log(err));
};

exports.createOrder = async (req, res) => {
  try {
    let fetchedCart = await req.user.getCart();
    let products = await fetchedCart.getProducts();

    if (products.length == 0) {
      return res.status(400).send({ msg: "Cart is empty" });
    } else {
      let total = 0;
      for (const p of products) {
        total = total + p.price * p.cartItem.quantity;
      }
      // console.log(total);
      let order = await req.user.createOrder({ total });
      //this also works
      // products.map((product) => {
      //   order.addProduct(product, {
      //     through: { quantity: product.cartItem.quantity },
      //   });
      // });
      let addingProducts = await order.addProducts(
        products.map((product) => {
          product.orderItem = { quantity: product.cartItem.quantity };
          return product;
        })
      );
      let emptyCart = fetchedCart.setProducts(null);
      // console.log(order);
      res
        .status(200)
        .send({ msg: `sucess order with Order ID:${order.id} created` });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Internal server error 500" });
  }
};

exports.getOrders = async (req, res, next) => {
  const ID = req.user.id;
  // console.log(ID);

  try {
    const fullOrderDetails = await Order.findAll({
      include: [{ model: Product }],
      where: { userId: ID },
    });
    if (fullOrderDetails.length != 0) {
      return res.status(200).send(fullOrderDetails);
    } else {
      res.status(201).send({ msg: "No Orders Present" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server Error 500" });
  }
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
