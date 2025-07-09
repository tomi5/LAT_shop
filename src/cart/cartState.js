import { saveCart, loadCart } from '../storage/index.js';
import { isValidProduct, isValidQuantity } from '../utils/index.js';

let cartItems = [];

export const getCartItems = () => [...cartItems];

export const setCartItems = items => {
  cartItems = [...items];
  saveCart(cartItems);
};

export const addItem = (product, quantity = 1) => {
  if (!isValidProduct(product) || !isValidQuantity(quantity)) return false;
  
  const existingIndex = cartItems.findIndex(item => item.product.added_id === product.added_id);
  
  if (existingIndex >= 0) {
    cartItems[existingIndex] = {
      ...cartItems[existingIndex],
      quantity: cartItems[existingIndex].quantity + quantity
    };
  } else {
    cartItems.push({ product, quantity });
  }
  
  saveCart(cartItems);
  return true;
};

export const updateItemQuantity = (productId, newQuantity) => {
  if (!isValidQuantity(newQuantity)) return false;
  
  const itemIndex = cartItems.findIndex(item => item.product.added_id === productId);
  if (itemIndex === -1) return false;
  
  cartItems[itemIndex] = {
    ...cartItems[itemIndex],
    quantity: newQuantity
  };
  
  saveCart(cartItems);
  return true;
};

export const removeItem = productId => {
  cartItems = cartItems.filter(item => item.product.added_id !== productId);
  saveCart(cartItems);
};

export const initializeCart = () => {
  cartItems = loadCart();
};