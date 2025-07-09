import { initCart } from './components/cart.js';
import { loadAndRenderProducts } from './components/shop.js';

document.addEventListener('DOMContentLoaded', () => {
    initCart();
    loadAndRenderProducts();
});