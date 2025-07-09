import { createElement, querySelector, formatPrice } from '../utils/index.js';
import { addItem, renderCart } from '../cart/index.js';
import * as constants from '../constants/shop.js';

export const renderProducts = products => {
  const container = querySelector(constants.GRID_CONTAINER_SELECTOR);
  if (!container) return;
  
  container.innerHTML = '';
  products.forEach(product => {
    container.appendChild(createProductItem(product));
  });
};

const createProductItem = product => {
  const item = createElement('div', constants.GRID_ITEM_CLASS);
  
  item.innerHTML = `
    <div class="${constants.PHOTO_CELL_CLASS}">
      <img src="${product.image_url || 'placeholder.jpg'}" alt="${product.product_name}" style="max-width: 100%;">
    </div>
    <div class="${constants.HEADER_CELL_CLASS}">
      <div class="${constants.PRODUCT_NAME_CLASS}">${product.product_name}</div>
      <div class="${constants.MANUFACTURER_CLASS}">${product.manufacturer}</div>
    </div>
    <div class="${constants.DESCRIPTION_CLASS}">${product.short_description}</div>
    <div class="${constants.PRICE_CLASS}">${formatPrice(product.price)}</div>
    <div class="${constants.QUANTITY_CLASS}">
      <div class="${constants.QUANTITY_NUMBER_CLASS}">
        <input type="number" min="1" value="1" class="${constants.QUANTITY_INPUT_CLASS}">
      </div>
      <div class="${constants.QUANTITY_PLUS_MINUS_CLASS}">
        <div class="${constants.QUANTITY_BTN_CLASS}">
          <button type="button" class="${constants.BUTTON_ADD_MIN_CLASS}" data-action="plus">+</button>
        </div>
        <div class="${constants.QUANTITY_BTN_CLASS}">
          <button type="button" class="${constants.BUTTON_ADD_MIN_CLASS}" data-action="minus">-</button>
        </div>
      </div>
      <div class="${constants.ADD_BTN_CLASS}">
        <button type="button" class="${constants.ADD_TO_CART_BTN_CLASS}" data-product='${JSON.stringify(product)}'>
          <svg width="24" height="24" viewBox="0 0 902.86 902.86" fill="#000000">
            <path d="M671.504,577.829l110.485-432.609H902.86v-68H729.174L703.128,179.2L0,178.697l74.753,399.129h596.751V577.829z M685.766,247.188l-67.077,262.64H131.199L81.928,246.756L685.766,247.188z"/>
            <path d="M578.418,825.641c59.961,0,108.743-48.783,108.743-108.744s-48.782-108.742-108.743-108.742H168.717 c-59.961,0-108.744,48.781-108.744,108.742s48.782,108.744,108.744,108.744c59.962,0,108.743-48.783,108.743-108.744 c0-14.4-2.821-28.152-7.927-40.742h208.069c-5.107,12.59-7.928,26.342-7.928,40.742 C469.675,776.858,518.457,825.641,578.418,825.641z M209.46,716.897c0,22.467-18.277,40.744-40.743,40.744 c-22.466,0-40.744-18.277-40.744-40.744c0-22.465,18.277-40.742,40.744-40.742C191.183,676.155,209.46,694.432,209.46,716.897z M619.162,716.897c0,22.467-18.277,40.744-40.743,40.744s-40.743-18.277-40.743-40.744c0-22.465,18.277-40.742,40.743-40.742 S619.162,694.432,619.162,716.897z"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  
  setupProductEvents(item, product);
  return item;
};

const setupProductEvents = (item, product) => {
  const quantityInput = item.querySelector(constants.QUANTITY_INPUT_SELECTOR);
  const plusBtn = item.querySelector(`${constants.BUTTON_ADD_MIN_SELECTOR}[data-action="plus"]`);
  const minusBtn = item.querySelector(`${constants.BUTTON_ADD_MIN_SELECTOR}[data-action="minus"]`);
  const addBtn = item.querySelector(constants.ADD_TO_CART_BTN_SELECTOR);
  
  plusBtn.addEventListener('click', () => {
    quantityInput.value = parseInt(quantityInput.value) + 1;
  });
  
  minusBtn.addEventListener('click', () => {
    const value = parseInt(quantityInput.value);
    if (value > 1) quantityInput.value = value - 1;
  });
  
  addBtn.addEventListener('click', () => {
    const quantity = parseInt(quantityInput.value);
    if (addItem(product, quantity)) {
      renderCart();
    }
  });
};