//{products:[{id,qty}],total}
const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");

module.exports = class Cart {
  static addCart(id, productPrice) {
    //step 1: read the cart data
    //step 2:check if id is already present in cart; increase quantity
    //step 3: if not present; spread the products array as it is and add the new product{id: , qty:1}
    //step 4: increase the total price
    fs.readFile(path.join(rootDir, "data", "cart.json"), (err, cartData) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(cartData);
      }
      let { products, totalPrice } = cart;
      const productById = products.find((prod) => prod.id == id);
      if (productById) {
        productById.qty = productById.qty + 1;
      } else {
        products = [...products, { id: id, qty: 1 }];
      }
      totalPrice = +totalPrice + +productPrice; // using + before total Price is to convert the string to number
      cart.products = products;
      cart.totalPrice = totalPrice;

      fs.writeFile(
        path.join(rootDir, "data", "cart.json"),
        JSON.stringify(cart),
        (err) => console.log(err)
      );
    });

    // fs.readFile(
    //   path.join(rootDir, "data", "products.json"),
    //   (err, productsData) => {
    //     const products = JSON.parse(productsData);
    //     const product = products.find((p) => p.id == id);
    //     fs.readFile(
    //       path.join(rootDir, "data", "cart.json"),
    //       (err, cartData) => {
    //         let cart = { products: [], total: 0 };
    //         if (err) {
    //           cart.products.push({ id: id, qty: 1 });
    //           cart.total = product.price;
    //         } else {
    //           //loop through the products arr and find product
    //           cart = JSON.parse(cartData);
    //           const prod = cart.products.find((p) => p.id == id);
    //           if (prod) {
    //             prod.qty = prod.qty + 1;
    //             cart.total = +cart.total + +product.price;
    //           } else {
    //             cart.products.push({ id: id, qty: 1 });
    //             cart.total = +cart.total + +product.price;
    //           }
    //         }
    //         fs.writeFile(
    //           path.join(rootDir, "data", "cart.json"),
    //           JSON.stringify(cart),
    //           (err) => {
    //             console.log(err);
    //           }
    //         );
    //       }
    //     );
    //   }
    // );
  }
};
