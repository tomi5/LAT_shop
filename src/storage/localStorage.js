import { STORAGE_KEYS } from '../constants/index.js';

const CART_KEY = STORAGE_KEYS.CART;

export const saveCart = items => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart:', error);
  }
};

export const loadCart = () => {
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load cart:', error);
    return [];
  }
};

export const clearCart = () => localStorage.removeItem(CART_KEY);