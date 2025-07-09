export const formatPrice = price => `${price.toFixed(2)} zł`;
export const formatId = text => text.replace(/\s+/g, '-').toLowerCase();
export const parseProductId = str => parseInt(str, 10);