const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/product/:productId", shopController.getProductDetails);

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

router.post("/updateCart", shopController.postUpdateCart);

router.post("/cart-delete-item", shopController.postDeleteProductFromCart);

router.post("/orders", shopController.createOrder);

router.get("/orders", shopController.getOrders);

router.get("/checkout", shopController.getCheckout);

module.exports = router;
