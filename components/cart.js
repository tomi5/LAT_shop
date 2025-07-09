import {    RIGHT_COLUMN_CLASS,
    CART_CONTAINER_CLASS,
    CART_SUMMARY_CLASS,
    MANUFACTURER_CONTAINER_CLASS,
    MANUFACTURER_HEADER_CLASS,
    MANUFACTURER_FOOTER_CLASS,
    MANUFACTURER_CHECKBOX_CLASS,
    GRID_ITEM_CART_CLASS,
    LEFT_SECTION_CLASS,
    RIGHT_SECTION_CLASS,
    PRODUCT_NAME_CLASS,
    PRICE_CLASS,
    QUANTITY_CLASS,
    PLUS_MINUS_CLASS,
    PLUS_MINUS_BTN_CONTAINER,
    PLUS_MINUS_BTN,
    ITEM_CHECKBOX_CLASS,
    QUANTITY_PLUS_CLASS,
    QUANTITY_MINUS_CLASS,
    REMOVE_ITEM_CLASS,
    BUTTON_ADD_MIN_SMALLER,
    BUTTON_ADD_MIN,
    MANUFACTURER_CONTAINER_SELECTOR,
    ITEM_CHECKBOX_SELECTOR,
    MANUFACTURER_CHECKBOX_SELECTOR,
    MANUFACTURER_FOOTER_SELECTOR,
    QUANTITY_PLUS_SELECTOR,
    QUANTITY_MINUS_SELECTOR,
    REMOVE_ITEM_SELECTOR,
    translations,
    CART_FOOTER_SELECTOR} from "/cartConstants.js"

import { saveCartToStorage,loadCartFromStorage} from "./localStorage.js";

let cartItems = [];

export function addToCart(product, quantity = 1) {
    const existingItem = cartItems.find(item => item.product.added_id === product.added_id); //na id
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartItems.push({
            product: product,
            quantity: quantity
        });
    }
    
    updateCartDisplay();
    saveCartToStorage(cartItems);
}

export function updateCartDisplay() {
    const rightColumn = document.querySelector(`.${RIGHT_COLUMN_CLASS}`);
    let cartContainer = document.querySelector(`.${CART_CONTAINER_CLASS}`);
    let cartFooter = document.querySelector(`${CART_FOOTER_SELECTOR}`);


    if (!cartContainer) {
        cartContainer = document.createElement('div');
        cartContainer.className = CART_CONTAINER_CLASS;
        rightColumn.appendChild(cartContainer);
    }

    
    cartContainer.innerHTML = '';
    
    if (!cartItems.length) {
        updateCartFooter();
        cartContainer.innerHTML = `<p>${translations.EMPTY_CART}</p>`;
        return;
    }
    
    const manufacturers = groupItemsByManufacturer();

    Object.entries(manufacturers).forEach(([manufacturer, items]) => {
        const manufacturerSection = createManufacturerSection(manufacturer, items);
        cartContainer.appendChild(manufacturerSection);
    });

 if (!cartFooter) {
        cartFooter = createCartFooter();
        rightColumn.appendChild(cartFooter);
    } else {
        updateCartFooter();
    }
    
    
    addCartEventListeners();
    saveCartToStorage(cartItems);
}

function groupItemsByManufacturer() {
    return cartItems.reduce((acc, item) => {
        const manufacturer = item.product.manufacturer;
        if (!acc[manufacturer]) acc[manufacturer] = [];
        acc[manufacturer].push(item);
        return acc;
    }, {});
}

function createManufacturerSection(manufacturer, items) {
    const section = document.createElement('div');
    section.className = MANUFACTURER_CONTAINER_CLASS;

    const manufacturerId = `manufacturer-${manufacturer.replace(/\s+/g, '-').toLowerCase()}`;
    const manufacturerTotal = calculateManufacturerTotal(manufacturer, items);

    const header = document.createElement('div');
    header.className = MANUFACTURER_HEADER_CLASS;
    header.innerHTML = `
        <input type="checkbox" id="${manufacturerId}" 
               class="${MANUFACTURER_CHECKBOX_CLASS}" checked />
        <label for="${manufacturerId}">${manufacturer}</label>
        
    `;
    section.appendChild(header);


    const productsContainer = document.createElement('div');
    items.forEach((item, index) => {
        productsContainer.appendChild(createCartItemElement(item, manufacturerId, index));
    });
    section.appendChild(productsContainer);


    const footer = document.createElement('div');
    footer.className = MANUFACTURER_FOOTER_CLASS;
    footer.innerHTML = `Suma: ${manufacturerTotal.toFixed(2)} zł`;
    section.appendChild(footer);


    
    return section;
}

function createCartItemElement(item, manufacturerId, index) {
    const cartItem = document.createElement('div');
    cartItem.className = GRID_ITEM_CART_CLASS;
    
    if (index >= 1) {
        cartItem.style.paddingTop = "10px";
    }

    const itemId = `item-${manufacturerId}-${item.product.product_name.replace(/\s+/g, '-').toLowerCase()}`;
    
    cartItem.innerHTML = `
        <div class="${LEFT_SECTION_CLASS}">
            <div class="${PRODUCT_NAME_CLASS}">
                <input type="checkbox" id="${itemId}" 
                       class="${ITEM_CHECKBOX_CLASS}" checked />
                <label for="${itemId}">${item.product.product_name}</label>
            </div>
            <div class="${PRICE_CLASS}">${item.product.price.toFixed(2)} zł</div>
            <div class="${QUANTITY_CLASS}">${item.quantity}</div>
            <div class="${PLUS_MINUS_CLASS}">
                <div class="${PLUS_MINUS_BTN_CONTAINER}">
                    <div class="${PLUS_MINUS_BTN}">
                        <button type="button" class="${BUTTON_ADD_MIN_SMALLER} ${QUANTITY_PLUS_CLASS}" 
                                data-product="${item.product.added_id}">+</button>
                    </div>
                    <div class="${PLUS_MINUS_BTN}">
                        <button type="button" class="${BUTTON_ADD_MIN_SMALLER} ${QUANTITY_MINUS_CLASS}" 
                                data-product="${item.product.added_id}">-</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="${RIGHT_SECTION_CLASS}">
            <button type="button" class="${BUTTON_ADD_MIN} ${REMOVE_ITEM_CLASS}" 
                    data-product="${item.product.added_id}">-</button>
        </div>
    `;
    
    return cartItem;
}

function addCartEventListeners() {
    document.querySelectorAll(QUANTITY_PLUS_SELECTOR).forEach(btn => {
        btn.addEventListener('click', handleQuantityChange);
    });
    
    document.querySelectorAll(QUANTITY_MINUS_SELECTOR).forEach(btn => {
        btn.addEventListener('click', handleQuantityChange);
    });
    
    document.querySelectorAll(REMOVE_ITEM_SELECTOR).forEach(btn => {
        btn.addEventListener('click', handleRemoveItem);
    });
    
    document.querySelectorAll(MANUFACTURER_CHECKBOX_SELECTOR).forEach(checkbox => {
        checkbox.addEventListener('change', handleManufacturerCheckbox);
    });

    document.querySelectorAll(`${ITEM_CHECKBOX_SELECTOR}, ${MANUFACTURER_CHECKBOX_SELECTOR}`).forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });

}

function handleQuantityChange(e) {
    const productId = parseInt(e.target.dataset.product); 
    
    const item = cartItems.find(item => item.product.added_id === productId );

    if (item) {
        item.quantity += e.target.classList.contains(QUANTITY_PLUS_CLASS) ? 1 : -1;
        if (item.quantity < 1) item.quantity = 1;
        updateCartDisplay();
    }
}

function handleRemoveItem(e) {
    const productId = parseInt(e.target.dataset.product);

    cartItems = cartItems.filter(item => 
        item.product.added_id !== productId
    );

    updateCartDisplay();
    saveCartToStorage(cartItems);
}

function handleManufacturerCheckbox(e) {
    const manufacturerContainer = e.target.closest(MANUFACTURER_CONTAINER_SELECTOR);
    const checkboxes = manufacturerContainer.querySelectorAll(ITEM_CHECKBOX_SELECTOR);
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = e.target.checked;
    });
    
    updateTotals();
}

function createCartFooter() {
    const footer = document.createElement('div');
    footer.className = CART_SUMMARY_CLASS;
    updateCartFooter();
    
    return footer;
}

function handleCheckboxChange() {
    updateTotals();
}

function calculateManufacturerTotal(manufacturer, items) {
    const manufacturerCheckbox = document.querySelector(`${MANUFACTURER_CHECKBOX_SELECTOR}[id="manufacturer-${manufacturer.replace(/\s+/g, '-').toLowerCase()}"]`);
    const isManufacturerChecked = manufacturerCheckbox ? manufacturerCheckbox.checked : true;

    return items.reduce((sum, item) => {

        const itemCheckbox = document.querySelector(`${ITEM_CHECKBOX_SELECTOR}[id^="item-manufacturer-${manufacturer.replace(/\s+/g, '-').toLowerCase()}"]`);
        const isItemChecked = itemCheckbox ? itemCheckbox.checked : true;
        
        if (isManufacturerChecked && isItemChecked) {
            return sum + (item.product.price * item.quantity);
        }
        return sum;
    }, 0);
}

function updateCartFooter() {
    const cartFooter = document.querySelector(CART_FOOTER_SELECTOR);
    if (!cartFooter) return;
    
    const grandTotal = calculateGrandTotal();
    cartFooter.innerHTML = `<strong>ŁĄCZNA SUMA: ${grandTotal.toFixed(2)} zł</strong>`;
    cartFooter.style.display = 'flex';

}


function calculateGrandTotal() {
    let total = 0;
    
    document.querySelectorAll(MANUFACTURER_CONTAINER_SELECTOR).forEach(container => {
        const items = Array.from(container.querySelectorAll(`.${GRID_ITEM_CART_CLASS}`))
            .map(itemEl => {
                return {
                    product: {
                        product_name: itemEl.querySelector(`.${PRODUCT_NAME_CLASS} label`).textContent,
                        price: parseFloat(itemEl.querySelector(`.${PRICE_CLASS}`).textContent)
                    },
                    quantity: parseInt(itemEl.querySelector(`.${QUANTITY_CLASS}`).textContent),
                    checked: itemEl.querySelector(ITEM_CHECKBOX_SELECTOR).checked
                };
            });
        
        const manufacturerCheckbox = container.querySelector(MANUFACTURER_CHECKBOX_SELECTOR);
        const isManufacturerChecked = manufacturerCheckbox ? manufacturerCheckbox.checked : true;
        
        if (isManufacturerChecked) {
            items.forEach(item => {
                if (item.checked) {
                    total += item.product.price * item.quantity;
                }
            });
        }
    });
    
    return total;
}

function updateTotals() {
    document.querySelectorAll(MANUFACTURER_CONTAINER_SELECTOR).forEach(container => {
    const manufacturerCheckbox = container.querySelector(MANUFACTURER_CHECKBOX_SELECTOR);
    const isManufacturerChecked = manufacturerCheckbox.checked;
    
    let total = 0;
        
    container.querySelectorAll(`.${GRID_ITEM_CART_CLASS}`).forEach(itemEl => {
        const itemCheckbox = itemEl.querySelector(ITEM_CHECKBOX_SELECTOR);
        const price = parseFloat(itemEl.querySelector(`.${PRICE_CLASS}`).textContent);
        const quantity = parseInt(itemEl.querySelector(`.${QUANTITY_CLASS}`).textContent);
            
        if (isManufacturerChecked && itemCheckbox.checked) {
            total += price * quantity;
        }
    });
        
    const footer = container.querySelector(MANUFACTURER_FOOTER_SELECTOR);
        if (footer) {
            footer.textContent = `Suma: ${total.toFixed(2)} zł`;
        }
    });
    
    updateCartFooter();
}

export function initCart() {
    cartItems = loadCartFromStorage();
    loadCartFromStorage();
}
