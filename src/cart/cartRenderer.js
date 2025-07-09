import { createElement, querySelector, addEventListeners, formatPrice, formatId, parseProductId } from '../utils/index.js';
import { groupByManufacturer, calculateManufacturerTotal, getFormattedTotal } from './cartOperations.js';
import { getCartItems, updateItemQuantity, removeItem } from './cartState.js';
import * as constants from '../constants/cart.js';

export const renderCart = () => {
  const container = querySelector(`.${constants.CART_CONTAINER_CLASS}`);
  if (!container) return;
  
  container.innerHTML = '';
  
  const items = getCartItems();
  if (!items.length) {
    container.innerHTML = `<p>${constants.translations.EMPTY_CART}</p>`;
    renderCartFooter();
    return;
  }
  
  const manufacturers = groupByManufacturer();
  Object.entries(manufacturers).forEach(([manufacturer, items]) => {
    container.appendChild(createManufacturerSection(manufacturer, items));
  });
  
  renderCartFooter();
  attachEventListeners();
};

const createManufacturerSection = (manufacturer, items) => {
  const section = createElement('div', constants.MANUFACTURER_CONTAINER_CLASS);
  const manufacturerId = `manufacturer-${formatId(manufacturer)}`;
  const total = calculateManufacturerTotal(items);
  
  section.appendChild(createManufacturerHeader(manufacturerId, manufacturer));
  items.forEach((item, index) => {
    section.appendChild(createCartItem(item, manufacturerId, index));
  });
  section.appendChild(createManufacturerFooter(total));
  
  return section;
};

const createManufacturerHeader = (id, manufacturer) => 
  createElement('div', constants.MANUFACTURER_HEADER_CLASS, `
    <input type="checkbox" id="${id}" class="${constants.MANUFACTURER_CHECKBOX_CLASS}" checked />
    <label for="${id}">${manufacturer}</label>
  `);

const createCartItem = (item, manufacturerId, index) => {
  const cartItem = createElement('div', constants.GRID_ITEM_CART_CLASS);
  if (index >= 1) cartItem.style.paddingTop = "10px";
  
  const itemId = `item-${manufacturerId}-${formatId(item.product.product_name)}`;
  
  cartItem.innerHTML = `
    <div class="${constants.LEFT_SECTION_CLASS}">
      <div class="${constants.PRODUCT_NAME_CLASS}">
        <input type="checkbox" id="${itemId}" class="${constants.ITEM_CHECKBOX_CLASS}" checked />
        <label for="${itemId}">${item.product.product_name}</label>
      </div>
      <div class="${constants.PRICE_CLASS}">${formatPrice(item.product.price)}</div>
      <div class="${constants.QUANTITY_CLASS}">${item.quantity}</div>
      <div class="${constants.PLUS_MINUS_CLASS}">
        <div class="${constants.PLUS_MINUS_BTN_CONTAINER}">
          <div class="${constants.PLUS_MINUS_BTN}">
            <button type="button" class="${constants.BUTTON_ADD_MIN_SMALLER} ${constants.QUANTITY_PLUS_CLASS}" 
                    data-product="${item.product.added_id}">+</button>
          </div>
          <div class="${constants.PLUS_MINUS_BTN}">
            <button type="button" class="${constants.BUTTON_ADD_MIN_SMALLER} ${constants.QUANTITY_MINUS_CLASS}" 
                    data-product="${item.product.added_id}">-</button>
          </div>
        </div>
      </div>
    </div>
    <div class="${constants.RIGHT_SECTION_CLASS}">
      <button type="button" class="${constants.BUTTON_ADD_MIN} ${constants.REMOVE_ITEM_CLASS}" 
              data-product="${item.product.added_id}">-</button>
    </div>
  `;
  
  return cartItem;
};

const createManufacturerFooter = total => 
  createElement('div', constants.MANUFACTURER_FOOTER_CLASS, `Suma: ${formatPrice(total)}`);

const renderCartFooter = () => {
  const footer = querySelector(constants.CART_FOOTER_SELECTOR);
  if (!footer) return;
  
  footer.innerHTML = `<strong>ŁĄCZNA SUMA: ${getFormattedTotal()}</strong>`;
  footer.style.display = 'flex';
};

const attachEventListeners = () => {
  addEventListeners(constants.QUANTITY_PLUS_SELECTOR, 'click', handleQuantityChange);
  addEventListeners(constants.QUANTITY_MINUS_SELECTOR, 'click', handleQuantityChange);
  addEventListeners(constants.REMOVE_ITEM_SELECTOR, 'click', handleRemoveItem);
};

const handleQuantityChange = e => {
  const productId = parseProductId(e.target.dataset.product);
  const isPlus = e.target.classList.contains(constants.QUANTITY_PLUS_CLASS);
  const currentItem = getCartItems().find(item => item.product.added_id === productId);
  
  if (currentItem) {
    const newQuantity = currentItem.quantity + (isPlus ? 1 : -1);
    if (newQuantity >= 1) {
      updateItemQuantity(productId, newQuantity);
      renderCart();
    }
  }
};

const handleRemoveItem = e => {
  const productId = parseProductId(e.target.dataset.product);
  removeItem(productId);
  renderCart();
};