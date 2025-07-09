import { getCartItems } from './cartState.js';
import { formatPrice } from '../utils/index.js';

export const groupByManufacturer = () => 
  getCartItems().reduce((acc, item) => {
    const manufacturer = item.product.manufacturer;
    if (!acc[manufacturer]) acc[manufacturer] = [];
    acc[manufacturer].push(item);
    return acc;
  }, {});

export const calculateItemTotal = item => item.product.price * item.quantity;

export const calculateManufacturerTotal = items => 
  items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

export const calculateGrandTotal = () => 
  getCartItems().reduce((sum, item) => sum + calculateItemTotal(item), 0);

export const getFormattedTotal = () => formatPrice(calculateGrandTotal());