export function saveCartToStorage(cartItems){
    localStorage.setItem('cart',JSON.stringify(cartItems));
}

export function loadCartFromStorage(){
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
}

export function clearCartStorage(){
    localStorage.removeItem('cart');
}