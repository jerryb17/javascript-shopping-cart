import items from "./items.json";
import globalEventListener from "./public/globalEventListener.js";
import { formatCurrency } from "./public/formatCurrency.js";
import { addToCart, shoppingCartButton } from "./shoppingCart";
const storeItemTemplate = document.querySelector("#store-item-template");
const storeItemContainer = document.querySelector("[data-store-container]");
const Image_Url = "https://dummyimage.com/420x260";

export function setupStore() {
  // handle click to add to cart
  if (setupStore == null) return;
  globalEventListener("click", "[data-add-cart-button]", (e) => {
    const id = e.target.closest("[data-store-item]").dataset.itemId;
    addToCart(parseInt(id));
  });
  items.forEach(renderStoreItem);
}

function renderStoreItem(item) {
  const storeItem = storeItemTemplate.content.cloneNode(true);

  const container = storeItem.querySelector("[data-store-item]");
  container.dataset.itemId = item.id;

  const name = storeItem.querySelector("[data-name]");
  name.innerText = item.name;

  const category = storeItem.querySelector("[data-category]");
  category.innerText = item.category;

  const image = storeItem.querySelector("[data-image]");
  image.src = `${Image_Url}/${item.imageColor}/${item.imageColor}`;

  const price = storeItem.querySelector("[data-price]");
  price.innerText = formatCurrency(item.priceCents / 100);

  storeItemContainer.appendChild(storeItem);
}
