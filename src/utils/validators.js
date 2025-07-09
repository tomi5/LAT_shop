export const isValidQuantity = quantity => Number.isInteger(quantity) && quantity > 0;
export const isValidProduct = product => product && product.added_id !== undefined;