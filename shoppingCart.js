import items from "./items.json";
import { formatCurrency } from "./public/formatCurrency.js";
import globalEventListener from "./public/globalEventListener.js";

const dataItemWrapper = document.querySelector("[data-item-cart-wrapper]");
const dataCartButton = document.querySelector("[data-cart-button]");
const dataItemQuantity = document.querySelector("[data-item-quantity]");
const dataCartItemContainer = document.querySelector(
  "[data-cart-item-container]"
);
const cart = document.querySelector("[Cart]");
const cartItemTemplate = document.querySelector("#data-cart-items-template");
const cartTotal = document.querySelector("[data-item-total]");

const imageURL = "https://dummyimage.com/210x130";
const _sessionStorageKey = "Shopping_Cart-cart";
let shoppingCart = loadCart();

export function shoppingCartButton() {
  globalEventListener("click", "[data-remove-from-cart-button]", (e) => {
    const id = parseInt(e.target.closest("[data-cart-item]").dataset.itemId);
    removeItemFromCart(id);
  });
  renderCart();
}

// show / hide cart
dataCartButton.addEventListener("click", () => {
  dataItemWrapper.classList.toggle("invisible");
});

// Add item
// handle click to add to cart
export function addToCart(id) {
  const existingItem = shoppingCart.find((entry) => {
    return entry.id == id;
  });
  // handle multiple of the same item in the cart
  if (existingItem) {
    existingItem.quantity++;
  } else {
    shoppingCart.push({ id: id, quantity: 1 });
  }

  renderCart();
  saveCart();
}
// remove item
function removeItemFromCart(id) {
  const existingItem = shoppingCart.find((entry) => {
    return entry.id === id;
  });
  if (existingItem == null) return;
  shoppingCart = shoppingCart.filter((entry) => {
    return entry.id !== id;
  });
  renderCart();
  saveCart();
}
// show / hide items when it doesn't have item or goes from 0 to 1
function renderCart() {
  if (shoppingCart.length === 0) {
    hideCart();
  } else {
    showCart();
    renderItem();
  }
}
// show / hide items in cart
function showCart() {
  cart.classList.remove("invisible");
}
function hideCart() {
  cart.classList.add("invisible");
  dataItemWrapper.classList.add("invisible");
}
function renderItem() {
  // calculate an accurate total
  const total = shoppingCart.reduce((sum, entry) => {
    const item = items.find((i) => entry.id === i.id);
    return sum + (item.priceCents * entry.quantity) / 100;
  }, 0);
  cartTotal.innerText = formatCurrency(total);
  dataCartItemContainer.innerHTML = "";
  dataItemQuantity.innerText = shoppingCart.length;
  shoppingCart.forEach((entry) => {
    const item = items.find((i) => entry.id === i.id);

    const cartItem = cartItemTemplate.content.cloneNode(true);

    const container = cartItem.querySelector("[data-cart-item]");
    container.dataset.itemId = item.id;

    const name = cartItem.querySelector("[data-cart-item-name]");
    name.innerText = item.name;

    // handle multiple items in the cart
    if (entry.quantity > 1) {
      const quantity = cartItem.querySelector("[data-cart-item-quantity]");
      quantity.innerText = `x ${entry.quantity}`;
    }

    const image = cartItem.querySelector("[data-cart-image]");
    image.src = `${imageURL}/${item.imageColor}/${item.imageColor}`;

    const price = cartItem.querySelector("[data-cart-item-price]");
    price.innerText = formatCurrency((item.priceCents * entry.quantity) / 100);

    dataCartItemContainer.appendChild(cartItem);
  });
}

// Persist across multiple pages
function saveCart() {
  sessionStorage.setItem(_sessionStorageKey, JSON.stringify(shoppingCart));
}
function loadCart() {
  let data = sessionStorage.getItem(_sessionStorageKey);
  return JSON.parse(data) || [];
}
