import { initializeCart, renderCart } from './cart/index.js';
import { loadProducts, renderProducts } from './shop/index.js';

const initApp = async () => {
  try {
    initializeCart();
    renderCart();
    
    const products = await loadProducts();
    renderProducts(products);
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
};

document.addEventListener('DOMContentLoaded', initApp);