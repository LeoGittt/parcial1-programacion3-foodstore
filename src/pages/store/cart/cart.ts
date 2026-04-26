import { getCart, updateQuantity, removeFromCart, clearCart, getCartTotal } from "../../../utils/cart";
import type { CartItem, Product } from "../../../types/product";

function getProductImage(product: Product): string {
  const categoryName = product.categorias.length > 0 ? product.categorias[0].nombre : "";

  if (categoryName === "Pizzas") return "/pizza/pexels-go_go-photos-3893032-6151203.jpg";
  if (categoryName === "Hamburguesas") return "/hamburguessa/pexels-nano-erdozain-120534369-19345991.jpg";
  if (categoryName === "Bebidas") return "/bebidas/pexels-alleksana-4113669.jpg";
  if (categoryName === "Postres") return "/postres/pexels-eden-fc-620771246-33731583.jpg";
  if (categoryName === "Empanadas") return "/empanadas/pexels-cotelo-32912393.jpg";
  if (categoryName === "Ensaladas") return "/ensaladas/pexels-eiliv-aceron-29416110-6896393.jpg";

  return "/vite.svg";
}

function init(): void {
  renderCart();
  setupEventListeners();
}

function renderCart(): void {
  const cartContent = document.getElementById("cartContent");
  if (!cartContent) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartContent.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <h3>Tu carrito está vacío</h3>
        <p>Agrega productos desde el catálogo para comenzar tu compra</p>
        <button class="continue-shopping-btn" id="continueShoppingBtn">
          Ir al catálogo
        </button>
      </div>
    `;

    const continueBtn = document.getElementById("continueShoppingBtn");
    if (continueBtn) {
      continueBtn.addEventListener("click", () => {
        window.location.href = "../home/home.html";
      });
    }

    return;
  }

  const itemsHTML = cart.map((item) => createCartItemHTML(item)).join("");

  const total = getCartTotal();

  cartContent.innerHTML = `
    <div class="cart-items">
      ${itemsHTML}
    </div>
    <div class="cart-summary">
      <div class="summary-row">
        <span>Subtotal:</span>
        <span>$${total.toFixed(2)}</span>
      </div>
      <div class="summary-row total">
        <span>Total:</span>
        <span>$${total.toFixed(2)}</span>
      </div>
    </div>
    <div class="cart-actions">
      <button class="clear-cart-btn" id="clearCartBtn">Vaciar carrito</button>
      <button class="continue-shopping-btn" id="continueShoppingBtn">
        Continuar comprando
      </button>
    </div>
  `;

  setupCartItemListeners();
}

function createCartItemHTML(item: CartItem): string {
  const { product, quantity } = item;
  const subtotal = product.precio * quantity;
  const imageUrl = getProductImage(product);

  return `
    <div class="cart-item" data-product-id="${product.id}">
      <div class="item-image">
        <img src="${imageUrl}" alt="${product.nombre}" />
      </div>
      <div class="item-details">
        <div class="item-name">${product.nombre}</div>
        <div class="item-price">$${product.precio.toFixed(2)} c/u</div>
      </div>
      <div class="item-quantity">
        <button class="quantity-btn decrease-btn" data-product-id="${product.id}">-</button>
        <span class="quantity-value">${quantity}</span>
        <button class="quantity-btn increase-btn" data-product-id="${product.id}">+</button>
      </div>
      <div class="item-subtotal">$${subtotal.toFixed(2)}</div>
      <button class="remove-btn" data-product-id="${product.id}">Eliminar</button>
    </div>
  `;
}

function setupCartItemListeners(): void {
  const increaseButtons = document.querySelectorAll(".increase-btn");
  increaseButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = parseInt((e.target as HTMLElement).dataset.productId || "0");
      const cart = getCart();
      const item = cart.find((item) => item.product.id === productId);
      if (item) {
        updateQuantity(productId, item.quantity + 1);
        renderCart();
      }
    });
  });

  const decreaseButtons = document.querySelectorAll(".decrease-btn");
  decreaseButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = parseInt((e.target as HTMLElement).dataset.productId || "0");
      const cart = getCart();
      const item = cart.find((item) => item.product.id === productId);
      if (item) {
        if (item.quantity > 1) {
          updateQuantity(productId, item.quantity - 1);
        } else {
          removeFromCart(productId);
        }
        renderCart();
      }
    });
  });

  const removeButtons = document.querySelectorAll(".remove-btn");
  removeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = parseInt((e.target as HTMLElement).dataset.productId || "0");
      
      if (confirm("¿Estás seguro de eliminar este producto del carrito?")) {
        removeFromCart(productId);
        renderCart();
      }
    });
  });

  // Botón de vaciar carrito
  const clearCartBtn = document.getElementById("clearCartBtn");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      if (confirm("¿Estás seguro de vaciar todo el carrito?")) {
        clearCart();
        renderCart();
      }
    });
  }

  // Botón de continuar comprando
  const continueBtn = document.getElementById("continueShoppingBtn");
  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      window.location.href = "../home/home.html";
    });
  }
}

// Configurar event listeners generales
function setupEventListeners(): void {
  // Botón de volver
  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "../home/home.html";
    });
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", init);
