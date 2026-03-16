import { getProducts } from './supabase.js';

let cart = [];
let allProducts = [];
const WHATSAPP_NUMBER = '527151312918';

async function loadProducts() {
  const loadingEl = document.getElementById('loading');
  const productsGrid = document.getElementById('products-grid');
  const noProducts = document.getElementById('no-products');

  try {
    const products = await getProducts();
    allProducts = products;

    loadingEl.style.display = 'none';

    if (products.length === 0) {
      noProducts.style.display = 'block';
      return;
    }

    showFeaturedProduct(products);
    displayProducts(products);

  } catch (error) {
    console.error('Error al cargar productos:', error);
    loadingEl.innerHTML = '<p>Error al cargar los productos. Por favor, intenta de nuevo.</p>';
  }
}

function showFeaturedProduct(products) {
  const featuredSection = document.getElementById('featured-section');
  const featuredCard = document.getElementById('featured-card');

  if (products.length > 0) {
    const featured = products[0];
    featuredSection.style.display = 'block';

    featuredCard.innerHTML = `
      <img src="${featured.image_url}" alt="${featured.name}" class="featured-image" onerror="this.src='https://via.placeholder.com/400x300?text=Imagen'">
      <div class="featured-info">
        <div class="featured-badge">🔥 Oferta del día</div>
        <h3>${featured.name}</h3>
        <p class="featured-description">${featured.description || ''}</p>
        <div class="featured-price">$${parseFloat(featured.price).toFixed(2)}</div>
        <div class="featured-availability">
          ✅ Disponible hoy en el tianguis
        </div>
        <div style="display: flex; gap: 1rem; margin-top: auto;">
          <button class="btn btn-primary btn-block" onclick="addToCart('${featured.id}', '${featured.name}', ${featured.price}, '${featured.image_url}')">
            Agregar al carrito
          </button>
          <a href="https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20quiero%20comprar%20${encodeURIComponent(featured.name)}" target="_blank" class="btn btn-whatsapp btn-block" style="text-align: center;">
            Comprar por WhatsApp
          </a>
        </div>
      </div>
    `;
  }
}

function displayProducts(products) {
  const productsGrid = document.getElementById('products-grid');
  const noProducts = document.getElementById('no-products');

  if (products.length === 0) {
    noProducts.style.display = 'block';
    return;
  }

  noProducts.style.display = 'none';

  productsGrid.innerHTML = products.map(product => `
    <div class="product-card">
      <img src="${product.image_url}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x250?text=Imagen+no+disponible'">
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-availability">
          ✅ Disponible hoy
        </div>
        <p class="product-description">${product.description || ''}</p>
        <div class="product-footer">
          <div class="product-price-container">
            <span class="product-price">$${parseFloat(product.price).toFixed(2)}</span>
          </div>
          <div class="product-buttons">
            <button class="btn btn-primary btn-small btn-block" onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.image_url}')">
              Agregar al carrito
            </button>
            <a href="https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20quiero%20comprar%20${encodeURIComponent(product.name)}%20a%20%24${parseFloat(product.price).toFixed(2)}" target="_blank" class="btn btn-whatsapp btn-small btn-block" style="text-align: center; text-decoration: none;">
              Comprar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function addToCart(id, name, price, imageUrl) {
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id,
      name,
      price: parseFloat(price),
      imageUrl,
      quantity: 1
    });
  }

  updateCart();
  updateCartCount();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
  updateCartCount();
}

function updateQuantity(id, change) {
  const item = cart.find(item => item.id === id);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      updateCart();
      updateCartCount();
    }
  }
}

function updateCart() {
  const cartItemsEl = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<div class="empty-cart"><p>Tu carrito está vacío</p></div>';
    cartTotalEl.textContent = '$0.00';
    return;
  }

  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/80?text=Imagen'">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-quantity">
          <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">&times;</button>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotalEl.textContent = `$${total.toFixed(2)}`;
}

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

function toggleCart() {
  const cartSidebar = document.getElementById('cart-sidebar');
  cartSidebar.classList.toggle('active');
}

function sendWhatsAppOrder() {
  if (cart.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }

  const orderDetails = cart.map(item =>
    `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}`
  ).join('%0A');

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const message = `¡Hola! Me gustaría hacer un pedido:%0A%0A${orderDetails}%0A%0ATotal: $${total.toFixed(2)}`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
}

function filterProducts(searchQuery) {
  const query = searchQuery.toLowerCase();
  const filtered = allProducts.filter(product =>
    product.name.toLowerCase().includes(query) ||
    (product.description && product.description.toLowerCase().includes(query))
  );

  const productsGrid = document.getElementById('products-grid');
  const noSearchResults = document.getElementById('no-search-results');

  if (filtered.length === 0) {
    productsGrid.innerHTML = '';
    noSearchResults.style.display = 'block';
  } else {
    noSearchResults.style.display = 'none';
    displayProducts(filtered);
  }
}

document.getElementById('cart-button').addEventListener('click', toggleCart);
document.getElementById('close-cart').addEventListener('click', toggleCart);

document.getElementById('order-pickup').addEventListener('click', () => {
  sendWhatsAppOrder();
});

document.getElementById('search-input').addEventListener('input', (e) => {
  const query = e.target.value.trim();
  if (query === '') {
    displayProducts(allProducts);
    document.getElementById('no-search-results').style.display = 'none';
  } else {
    filterProducts(query);
  }
});

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;

loadProducts();
