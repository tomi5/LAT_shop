import { ERROR_MESSAGES } from '../constants/index.js';

export const loadProducts = async () => {
  try {
    const response = await fetch('src/data/products.json');
    if (!response.ok) throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    return await response.json();
  } catch (error) {
    console.error(ERROR_MESSAGES.GENERAL_ERROR, error);
    throw new Error(ERROR_MESSAGES.LOADING_ERROR);
  }
};