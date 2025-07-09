import { addToCart } from './cart.js';
import {
    GRID_CONTAINER_SELECTOR,
    GRID_ITEM_CLASS,
    PHOTO_CELL_CLASS,
    HEADER_CELL_CLASS,
    PRODUCT_NAME_CLASS,
    MANUFACTURER_CLASS,
    DESCRIPTION_CLASS,
    PRICE_CLASS,
    QUANTITY_CLASS,
    QUANTITY_NUMBER_CLASS,
    QUANTITY_PLUS_MINUS_CLASS,
    QUANTITY_BTN_CLASS,
    ADD_BTN_CLASS,
    BUTTON_ADD_MIN_CLASS,
    ADD_TO_CART_BTN_CLASS,
    QUANTITY_INPUT_CLASS,
    QUANTITY_INPUT_SELECTOR,
    BUTTON_ADD_MIN_SELECTOR,
    ADD_TO_CART_BTN_SELECTOR,
    ERROR_MESSAGE_CLASS,
    ERROR_MESSAGES
} from '../shopConstants.js';


export function loadAndRenderProducts() {
    fetch('products.json')
        .then(response => {
            if (!response.ok) throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
            return response.json();
        })
        .then(products => {
            renderProducts(products);
        })
        .catch(error => {
            console.error(ERROR_MESSAGES.GENERAL_ERROR, error);
            showError(ERROR_MESSAGES.LOADING_ERROR);
        });
}

function renderProducts(products) {
    const gridContainer = document.querySelector(GRID_CONTAINER_SELECTOR);
    gridContainer.innerHTML = '';
    
    products.forEach(product => {
        const gridItem = createProductItem(product);
        gridContainer.appendChild(gridItem);
    });
}

function createProductItem(product) {
    const gridItem = document.createElement('div');
    gridItem.className = GRID_ITEM_CLASS;
    
    gridItem.innerHTML = `
        <div class="${PHOTO_CELL_CLASS}">
            <img src="${product.image_url || 'placeholder.jpg'}" alt="${product.product_name}" style="max-width: 100%;">
        </div>
        <div class="${HEADER_CELL_CLASS}">
            <div class="${PRODUCT_NAME_CLASS}">
                ${product.product_name}
            </div>
            <div class="${MANUFACTURER_CLASS}">
                ${product.manufacturer}
            </div>
        </div>
        <div class="${DESCRIPTION_CLASS}">
            ${product.short_description}
        </div>
        <div class="${PRICE_CLASS}">
            ${product.price.toFixed(2)} zł
        </div>
        <div class="${QUANTITY_CLASS}" class="position: relative;">
            <div class="${QUANTITY_NUMBER_CLASS}">
                <input type="number" min="1" value="1" class="${QUANTITY_INPUT_CLASS}">
            </div>
            <div class="${QUANTITY_PLUS_MINUS_CLASS}">
                <div class="${QUANTITY_BTN_CLASS}">
                    <button type="button" class="${BUTTON_ADD_MIN_CLASS}" data-action="plus">
                        +
                    </button>
                </div>
                <div class="${QUANTITY_BTN_CLASS}">
                    <button type="button" class="${BUTTON_ADD_MIN_CLASS}" data-action="minus">
                        -
                    </button>
                </div>
            </div>
             <div class="${ADD_BTN_CLASS}">
            <button type="button" class="${ADD_TO_CART_BTN_CLASS}" data-product='${JSON.stringify(product)}'>
                <svg width="24" height="24" viewBox="0 0 902.86 902.86" fill="#000000">
                    <path d="M671.504,577.829l110.485-432.609H902.86v-68H729.174L703.128,179.2L0,178.697l74.753,399.129h596.751V577.829z M685.766,247.188l-67.077,262.64H131.199L81.928,246.756L685.766,247.188z"/>
                    <path d="M578.418,825.641c59.961,0,108.743-48.783,108.743-108.744s-48.782-108.742-108.743-108.742H168.717 c-59.961,0-108.744,48.781-108.744,108.742s48.782,108.744,108.744,108.744c59.962,0,108.743-48.783,108.743-108.744 c0-14.4-2.821-28.152-7.927-40.742h208.069c-5.107,12.59-7.928,26.342-7.928,40.742 C469.675,776.858,518.457,825.641,578.418,825.641z M209.46,716.897c0,22.467-18.277,40.744-40.743,40.744 c-22.466,0-40.744-18.277-40.744-40.744c0-22.465,18.277-40.742,40.744-40.742C191.183,676.155,209.46,694.432,209.46,716.897z M619.162,716.897c0,22.467-18.277,40.744-40.743,40.744s-40.743-18.277-40.743-40.744c0-22.465,18.277-40.742,40.743-40.742 S619.162,694.432,619.162,716.897z"/>
                </svg>
            </button>
        </div>
        </div>
    `;

    setupQuantityButtons(gridItem);
    
    gridItem.querySelector(ADD_TO_CART_BTN_SELECTOR).addEventListener('click', () => {
        const quantity = parseInt(gridItem.querySelector(QUANTITY_INPUT_SELECTOR).value);
        addToCart(product, quantity);
    });

    return gridItem;
}

function setupQuantityButtons(gridItem) {
    const quantityInput = gridItem.querySelector(QUANTITY_INPUT_SELECTOR);
    const plusBtn = gridItem.querySelector(`${BUTTON_ADD_MIN_SELECTOR}[data-action="plus"]`);
    const minusBtn = gridItem.querySelector(`${BUTTON_ADD_MIN_SELECTOR}[data-action="minus"]`);

    plusBtn.addEventListener('click', () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    });

    minusBtn.addEventListener('click', () => {
        const value = parseInt(quantityInput.value);
        if (value > 1) quantityInput.value = value - 1;
    });
}

function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = ERROR_MESSAGE_CLASS;
    errorElement.textContent = message;
    document.body.prepend(errorElement);
}