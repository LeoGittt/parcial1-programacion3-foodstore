import { PRODUCTS, getCategories } from "../../../data/data";
import type { Product } from "../../../types/product";
import { addToCart, getCartItemCount } from "../../../utils/cart";

let currentProducts: Product[] = PRODUCTS;
let selectedCategory: string = "all";
let searchTerm: string = "";

const PRODUCTS_PER_PAGE = 12;
let currentPage: number = 1;
let totalPages: number = 1;

function init(): void {
  renderCategories();
  renderProducts();
  updateCartCount();
  setupEventListeners();
}

function renderCategories(): void {
  const categoryList = document.getElementById("categoryList");
  if (!categoryList) return;

  const categories = getCategories();

  categoryList.innerHTML = '';
  
  const allLi = document.createElement("li");
  allLi.className = "category-item active";
  allLi.dataset.category = "all";
  allLi.textContent = "Todas";
  allLi.addEventListener("click", () => handleCategoryClick("all"));
  categoryList.appendChild(allLi);

  categories.forEach((category) => {
    const li = document.createElement("li");
    li.className = "category-item";
    li.dataset.category = category.id.toString();
    li.textContent = category.nombre;
    li.addEventListener("click", () => handleCategoryClick(category.id.toString()));
    categoryList.appendChild(li);
  });
}

function handleCategoryClick(categoryId: string): void {
  selectedCategory = categoryId;

  const categoryItems = document.querySelectorAll(".category-item");
  categoryItems.forEach((item) => {
    item.classList.remove("active");
    if (item.getAttribute("data-category") === categoryId) {
      item.classList.add("active");
    }
  });

  filterProducts();
}

function filterProducts(): void {
  let filtered = PRODUCTS;

  if (selectedCategory !== "all") {
    const categoryIdNum = parseInt(selectedCategory);
    filtered = filtered.filter((product) =>
      product.categorias.some((cat) => cat.id === categoryIdNum)
    );
  }

  if (searchTerm.trim() !== "") {
    filtered = filtered.filter((product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  currentProducts = filtered;
  currentPage = 1;
  renderProducts();
}

function renderProducts(): void {
  const productsGrid = document.getElementById("productsGrid");
  if (!productsGrid) return;

  productsGrid.innerHTML = "";

  if (currentProducts.length === 0) {
    productsGrid.innerHTML = `
      <div class="no-results">
        <h2>😕 No se encontraron productos</h2>
        <p>Intenta con otros términos de búsqueda o categoría</p>
      </div>
    `;
    renderPagination();
    return;
  }

  totalPages = Math.ceil(currentProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const productsToShow = currentProducts.slice(startIndex, endIndex);

  productsToShow.forEach((product) => {
    const card = createProductCard(product);
    productsGrid.appendChild(card);
  });

  renderPagination();
}

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

function createProductCard(product: Product): HTMLDivElement {
  const card = document.createElement("div");
  card.className = "product-card";

  const categoryName = product.categorias.length > 0 ? product.categorias[0].nombre : "Sin categoría";
  const isAvailable = product.disponible && product.stock > 0;
  const imageUrl = getProductImage(product);

  card.innerHTML = `
    <div class="product-image">
      <img src="${imageUrl}" alt="${product.nombre}" />
    </div>
    <span class="product-category">${categoryName}</span>
    <h3 class="product-name">${product.nombre}</h3>
    <p class="product-description">${product.descripcion}</p>
    <div class="stock-info ${!isAvailable ? 'out-of-stock' : ''}">
      ${isAvailable ? `Stock: ${product.stock}` : "Sin stock"}
    </div>
    <div class="product-footer">
      <span class="product-price">$${product.precio.toFixed(2)}</span>
      <button 
        class="add-to-cart-btn" 
        ${!isAvailable ? "disabled" : ""}
        data-product-id="${product.id}"
      >
        ${isAvailable ? "Agregar" : "No disponible"}
      </button>
    </div>
  `;

  // Agregar evento al botón
  const addButton = card.querySelector(".add-to-cart-btn") as HTMLButtonElement;
  if (addButton && isAvailable) {
    addButton.addEventListener("click", () => handleAddToCart(product));
  }

  return card;
}

function handleAddToCart(product: Product): void {
  addToCart(product);
  updateCartCount();

  showToast(`${product.nombre} agregado al carrito`);

  const button = document.querySelector(`[data-product-id="${product.id}"]`) as HTMLButtonElement;
  if (button) {
    const originalText = button.textContent;
    button.textContent = "✓ Agregado";
    button.style.backgroundColor = "#4caf50";

    setTimeout(() => {
      button.textContent = originalText || "Agregar";
      button.style.backgroundColor = "";
    }, 1000);
  }
}

function showToast(message: string): void {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  
  if (toast && toastMessage) {
    toastMessage.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
}

function renderPagination(): void {
  const pagination = document.getElementById("pagination");
  if (!pagination) return;

  if (currentProducts.length === 0 || totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  let paginationHTML = `
    <button class="pagination-btn" id="prevBtn" ${currentPage === 1 ? "disabled" : ""}>
      ← Anterior
    </button>
  `;

  // Mostrar páginas
  const maxButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);

  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <button class="pagination-btn ${i === currentPage ? "active" : ""}" data-page="${i}">
        ${i}
      </button>
    `;
  }

  paginationHTML += `
    <button class="pagination-btn" id="nextBtn" ${currentPage === totalPages ? "disabled" : ""}>
      Siguiente →
    </button>
    <span class="pagination-info">
      Mostrando ${(currentPage - 1) * PRODUCTS_PER_PAGE + 1}-${Math.min(currentPage * PRODUCTS_PER_PAGE, currentProducts.length)} de ${currentProducts.length}
    </span>
  `;

  pagination.innerHTML = paginationHTML;

  // Event listeners para paginación
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderProducts();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderProducts();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // Botones de número de página
  const pageButtons = pagination.querySelectorAll("[data-page]");
  pageButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const page = parseInt((e.target as HTMLElement).dataset.page || "1");
      currentPage = page;
      renderProducts();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

// Actualizar contador del carrito
function updateCartCount(): void {
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    const count = getCartItemCount();
    cartCount.textContent = count.toString();
  }
}

// Configurar event listeners
function setupEventListeners(): void {
  // Búsqueda
  const searchBox = document.getElementById("searchBox") as HTMLInputElement;
  if (searchBox) {
    searchBox.addEventListener("input", (e) => {
      searchTerm = (e.target as HTMLInputElement).value;
      filterProducts();
    });
  }

  // Botón de carrito
  const cartBtn = document.getElementById("cartBtn");
  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      window.location.href = "../cart/cart.html";
    });
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", init);
