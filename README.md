# Food Store - Parcial 1 Programación III

**Alumno:** Leonel Gonzalez  
**DNI:** 43122514

## Descripción

Aplicación web de catálogo de productos con carrito de compras. Hecha para el Parcial 1 de Programación III.

Funcionalidades:
- Catalogo de productos con categorías
- Búsqueda por nombre
- Filtrado por categoría
- Carrito de compras
- Gestión de cantidades
- Persistencia con localStorage

## Tecnologías

- HTML5
- CSS3
- TypeScript
- Vite
- localStorage

## Instalación

Instalar pnpm si no lo tenés:

```bash
npm install -g pnpm
```

Instalar dependencias:

```bash
pnpm install
```

Ejecutar en desarrollo:

```bash
pnpm dev
```

La aplicación va a estar en `http://localhost:5173`

Compilar para producción:

```bash
pnpm build
```

## Estructura

```
src/
├── data/
│   └── data.ts              # Productos y categorías
├── pages/
│   └── store/
│       ├── home/
│       │   ├── home.html    # Página del catálogo
│       │   └── home.ts      # Lógica del catálogo
│       └── cart/
│           ├── cart.html    # Página del carrito
│           └── cart.ts      # Lógica del carrito
├── types/
│   ├── product.ts           # Interfaces Product y CartItem
│   └── category.ts          # Interface ICategory
└── utils/
    └── cart.ts              # Funciones del carrito
```

## Funcionalidades

### Catálogo (HU-P1-01, HU-P1-02)

- Visualización de productos con imagen, nombre, descripción, precio y stock
- Búsqueda en tiempo real
- Filtrado por categoría
- Paginación de 12 productos por página

### Carrito (HU-P1-03, HU-P1-04, HU-P1-05)

- Agregar productos
- Persistencia con localStorage
- Modificar cantidades
- Eliminar productos
- Cálculo de totales
- Contador en el header

## Datos

El carrito se guarda en localStorage con la clave `foodStoreCart`.

Hay 20 productos en 6 categorías: Pizzas, Hamburguesas, Bebidas, Postres, Empanadas, Ensaladas.

## Funciones principales (cart.ts)

- `getCart()`: Obtiene el carrito
- `addToCart(product)`: Agrega producto
- `updateQuantity(productId, quantity)`: Actualiza cantidad
- `removeFromCart(productId)`: Elimina producto
- `clearCart()`: Vacía el carrito
- `getCartTotal()`: Calcula el total
- `getCartItemCount()`: Cuenta items

## Notas

- No hay backend
- No hay proceso de compra
- Los productos son datos de prueba
