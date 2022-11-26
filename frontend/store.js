const openCart = document.querySelector(".open-cart");
const closeCart = document.querySelector(".close-cart");
const cart = document.querySelector(".cart-container");
const cartBody = document.querySelector(".cart-body ul");
const body = document.querySelector("body");

const createOrder = async (e) => {
  try {
    const response = await axios.post("http://13.233.255.73:3000/orders", {});
    // console.log(response.data.msg);
    hideCart();
    createToast(response.data.msg);
  } catch (error) {
    // console.log(error);
    console.log(error.response.data.msg);
    createToast(error.response.data.msg);
  }
};
//simple dom manipulation to find total
const findTotal = () => {
  const cartItems = document.querySelectorAll(".cart-item");
  let total = 0;
  for (let i = 0; i < cartItems.length; i++) {
    const price = cartItems[i].querySelector(".item-price").textContent;
    const quantity =
      cartItems[i].querySelector(".item-quantity").children[0].value;
    total = total + price * quantity;
  }
  document.querySelector(".cart-total").textContent = `Total ($) : ${total}`;
};

//change event on quantity of cart item
const updateTotal = async (e) => {
  try {
    const cartItemId = e.target.parentElement.querySelector(".cartItem-id").id;
    const quantity = e.target.parentElement.querySelector(".quantity");
    if (quantity.value <= 0) {
      quantity.value = 1;
    }
    const response = await axios.post("http://13.233.255.73:3000/updateCart", {
      cartItemId,
      quantity: quantity.value,
    });
    console.log(response.status);
    if (response.status == 200) {
      findTotal();
    }
  } catch (err) {
    console.log(err);
  }
};

//displaying each cart item on front end
const createItemInCart = ({ cartItem: { id, quantity }, price, title }) => {
  const itemRow = document.createElement("div");
  itemRow.innerHTML = `<li class="item-name">${title}</li>
    <li class="item-price">${price}</li>
    <li class="item-quantity">
      <input type="number" class="quantity" min="1" value=${quantity} />
      <span><button class="delete-item">✕</button></span>
      <input type="hidden" class="cartItem-id" id=${id} />
    </li>`;
  itemRow.className = "cart-item";

  const cartTable = document.querySelector(".cart-items");
  cartTable.insertAdjacentElement("beforeend", itemRow);
};

//getting the cart items from backend
const showCart = async () => {
  try {
    const response = await axios.get("http://13.233.255.73:3000/cart");
    console.log(response.data);
    const cartItems = response.data;
    //to remove existing cart to append new cart got from backend
    document.querySelectorAll(".cart-item").forEach((e) => e.remove());

    cartItems.forEach((cartItem) => {
      createItemInCart(cartItem);
    });
    findTotal();
  } catch (err) {
    console.log(err);
  }
  document.querySelector(".cart-container").style.visibility = "visible";
};
const hideCart = () => {
  document.querySelector(".cart-container").style.visibility = "hidden";
};
//deleting cart item
const deleteCartItem = async (e) => {
  e.preventDefault();
  if (e.target.className == "delete-item") {
    try {
      const cartItemId =
        e.target.parentElement.parentElement.querySelector(".cartItem-id").id;
      const response = await axios.post(
        "http://13.233.255.73:3000/cart-delete-item",
        {
          cartItemId,
        }
      );
      console.log(response);
      if (response.status == "200") {
        console.log(response.data.msg);
        e.target.parentElement.parentElement.parentElement.remove();
        findTotal();
        createToast("Item deleted from Cart");
      }
    } catch (err) {
      console.log(err.data.msg);
    }
  }
};
//to create a toast message
const createToast = (msg) => {
  const toast = document.createElement("div");
  toast.innerText = msg;
  toast.className = "toast";
  body.insertAdjacentElement("beforeend", toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
};

const checkIfItemExistsInCart = (itemName) => {
  const cartItems = document.querySelectorAll(".cart-item");
  for (let i = 0; i < cartItems.length; i++) {
    const name = cartItems[i].querySelector(".item-name").textContent;
    if (name == itemName) {
      return true;
    }
  }
  return false;
};

//adding the product to the cart in the backend
const addToCart = async (e) => {
  if (e.target.tagName == "BUTTON") {
    const parent = e.target.parentElement.parentElement;
    const itemName = parent.querySelector(".img-heading").textContent;
    const productId = e.target.id;

    // check if it is in the cart
    const itemExists = checkIfItemExistsInCart(itemName);
    if (itemExists) {
      return createToast("Product already present in the cart");
    } else {
      try {
        const response = await axios.post("http://13.233.255.73:3000/cart", {
          productId,
        });
        console.log(response.data.msg);
        createToast("Product added to the cart");
        showCart();
      } catch (err) {
        console.log(response.data.msg);
      }
    }
  }
};

//to display each individual product on screen
const displayProduct = ({ id, title, imageUrl, price }) => {
  // console.log(id, title, imageUrl, price);
  const imgContainer = document.querySelector(".img-container.music");
  // console.log(imgContainer);
  const img = document.createElement("div");
  img.className = "img";
  img.innerHTML = ` <h3 class="img-heading">${title}</h3>
  <img
    src=${imageUrl}
    alt="product image"
  />
  <div class="img-action">
    <p class="img-price">$${price}</p>
    <button id="${id}">Add to Cart</button>
  </div>`;
  imgContainer.insertAdjacentElement("beforeend", img);
};
const changePage = (e) => {
  if (e.target.tagName == "BUTTON") {
    const pageNum = e.target.textContent;
    console.log(pageNum);
    getProducts(pageNum);
  }
};
const displayPagination = ({
  currentPage,
  hasNextPage,
  hasPreviousPage,
  nextPage,
  previousPage,
  lastPage,
}) => {
  const pagination = document.querySelector(".pagination");
  if (hasNextPage && hasPreviousPage) {
    pagination.innerHTML = ` <button >${previousPage}</button>
    <button class="active">${currentPage}</button>
    <button >${nextPage}</button>`;
  } else if (!hasNextPage && !hasPreviousPage) {
    pagination.innerHTML = `<button class="active">${currentPage}</button>`;
  } else if (!hasPreviousPage && hasNextPage) {
    pagination.innerHTML = `<button class="active">${currentPage}</button>
    <button >${nextPage}</button>`;
  } else if (hasPreviousPage && !hasNextPage) {
    pagination.innerHTML = `<button>${previousPage}</button>
    <button class="active">${currentPage}</button>`;
  }
};
//to get all the products from backend
const getProducts = async (page = 1) => {
  try {
    const response = await axios.get(
      `http://13.233.255.73:3000/products/?page=${page}`
    );
    const products = response.data.products;
    const pagination = response.data.pagination;
    const imgContainer = document.querySelector(".img-container.music");
    imgContainer.innerHTML = "";
    products.forEach((product) => {
      displayProduct(product);
    });
    console.log(pagination);
    displayPagination(pagination);
  } catch (err) {
    console.log(err);
  }
};
openCart.addEventListener("click", showCart);
closeCart.addEventListener("click", hideCart);
document.addEventListener("DOMContentLoaded", getProducts);
