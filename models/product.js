const db = require("../util/database");

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }
  save() {
    if (this.id) {
      return db.execute(
        `UPDATE product SET title='${this.title}',imageUrl='${this.imageUrl}',price='${this.price}',description='${this.description}' WHERE id=${this.id}`
      );
    } else {
      return db.execute(
        `INSERT INTO product (title,price,imageUrl,description) VALUES (?,?,?,?)`,
        [this.title, this.price, this.imageUrl, this.description]
      );
    }
  }
  static fetchAll() {
    return db.execute("SELECT * from product");
  }
  static fetchById(id) {
    return db.execute(`SELECT * FROM product WHERE id=${id}`);
  }
  static deleteById(id) {
    return db.execute(`DELETE FROM product WHERE id=${id}`);
  }
};
// const p = path.join(
//   path.dirname(require.main.filename),
//   "data",
//   "products.json"
// );

// const getProductsFromFile = (cb) => {
//   fs.readFile(p, (err, fileData) => {
//     if (err) {
//       cb([]);
//     } else {
//       cb(JSON.parse(fileData)); //convert JSON to JS object
//     }
//   });
// };

// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     if (this.id) {
//       getProductsFromFile((products) => {
//         const existingProductIndex = products.findIndex(
//           (prod) => prod.id == this.id
//         );
//         const updatedProducts = [...products];
//         updatedProducts[existingProductIndex] = this;
//         fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//           console.log(err);
//         });
//       });
//     } else {
//       this.id = Math.random().toString();
//       getProductsFromFile((products) => {
//         products.push(this);
//         fs.writeFile(p, JSON.stringify(products), (err) => {
//           console.log(err);
//         });
//       });
//     }
//   }

//   static fetchAll(cb) {
//     getProductsFromFile(cb);
//   }

//   static fetchProductById(id, cb) {
//     getProductsFromFile((products) => {
//       const product = products.find((p) => p.id == id);
//       cb(product);
//     });
//   }
//   static deleteProductByid(id, cb) {
//     Product.fetchAll((products) => {
//       const updatedProducts = products.filter((p) => p.id != id);
//       fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//         console.log(err);
//         cb();
//       });
//     });
//   }
// };
