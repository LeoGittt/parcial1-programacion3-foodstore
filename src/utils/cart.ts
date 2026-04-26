import type { CartItem, Product } from "../types/product";

const CART_KEY = "foodStoreCart";

export function getCart(): CartItem[] {
  const cartData = localStorage.getItem(CART_KEY);
  return cartData ? JSON.parse(cartData) : [];
}

export function saveCart(cart: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product: Product): void {
  const cart = getCart();
  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ product, quantity: 1 });
  }

  saveCart(cart);
}

export function updateQuantity(productId: number, quantity: number): void {
  const cart = getCart();
  const item = cart.find((item) => item.product.id === productId);

  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      saveCart(cart);
    }
  }
}

export function removeFromCart(productId: number): void {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.product.id !== productId);
  saveCart(updatedCart);
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
}

export function getCartTotal(): number {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.product.precio * item.quantity, 0);
}

export function getCartItemCount(): number {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}
