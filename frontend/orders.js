const displayOrder = (id, total, products) => {
  const div = document.createElement("div");
  const main = document.querySelector("main");
  let text = `<div><strong>Order ID:</strong> ${id}</div>
  <div><strong>Order Total ($):</strong> ${total}</div>`;
  for (const product of products) {
    text =
      text +
      `<div><strong>Item:</strong> ${
        product.title
      } | <strong>Price/Item ($):</strong> ${
        product.price
      } | <strong>Quantity:</strong> ${
        product.orderItem.quantity
      } | <strong>Total ($):</strong> ${
        product.price * product.orderItem.quantity
      }<div> `;
  }
  div.innerHTML = text;
  div.className = "order";
  main.insertAdjacentElement("beforeend", div);
};

const getEachOrder = (orders) => {
  for (const order of orders) {
    const id = order.id;
    const products = order.products;
    const total = order.total;
    // console.log(id);
    // console.log(products);
    displayOrder(id, total, products);
  }
};

const getOrders = async () => {
  try {
    const orders = await axios.get("http://13.233.255.73:3000/orders");
    // document.querySelector("main").textContent = orders;
    console.log(orders);
    if (orders.status == 201) {
      console.log(orders.data.msg);
    } else {
      getEachOrder(orders.data);
    }
  } catch (err) {
    console.log(err);
  }
};

document.addEventListener("DOMContentLoaded", getOrders);
