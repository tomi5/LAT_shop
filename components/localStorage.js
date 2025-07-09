import { updateCartDisplay } from "./cart.js";

export function saveCartToStorage(cartItems){
    localStorage.setItem('cart',JSON.stringify(cartItems));
}

export function loadCartFromStorage(){
    const savedCart = localStorage.getItem('cart');
    if (savedCart){
        const cartItems = JSON.parse(savedCart);
        updateCartDisplay(cartItems);
        return cartItems
    }
    return [];
}

export function clearCartStorage(){
    localStorage.removeItem('cart');
}