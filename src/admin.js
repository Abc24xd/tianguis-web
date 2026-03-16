import { supabase, getProducts, addProduct, updateProduct, deleteProduct } from './supabase.js';

let currentUser = null;
let editingProductId = null;

async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    currentUser = session.user;
    showAdminDashboard();
    loadAdminProducts();
  } else {
    showLoginForm();
  }
}

function showLoginForm() {
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('admin-section').style.display = 'none';
  document.getElementById('logout-btn').style.display = 'none';
}

function showAdminDashboard() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('admin-section').style.display = 'block';
  document.getElementById('logout-btn').style.display = 'block';
}

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorEl = document.getElementById('login-error');

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    currentUser = data.user;
    showAdminDashboard();
    loadAdminProducts();

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    errorEl.textContent = 'Error: Correo o contraseña incorrectos';
    errorEl.style.display = 'block';
  }
}

async function handleLogout() {
  try {
    await supabase.auth.signOut();
    currentUser = null;
    showLoginForm();
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}

async function loadAdminProducts() {
  const loadingEl = document.getElementById('admin-loading');
  const tbody = document.getElementById('products-tbody');
  const noProducts = document.getElementById('no-products-admin');

  loadingEl.style.display = 'block';
  tbody.innerHTML = '';

  try {
    const products = await getProducts();

    loadingEl.style.display = 'none';

    if (products.length === 0) {
      noProducts.style.display = 'block';
      return;
    }

    noProducts.style.display = 'none';

    tbody.innerHTML = products.map(product => `
      <tr>
        <td>
          <img src="${product.image_url}" alt="${product.name}" class="product-thumbnail" onerror="this.src='https://via.placeholder.com/60?text=Sin+imagen'">
        </td>
        <td>${product.name}</td>
        <td>${product.description || '-'}</td>
        <td>$${parseFloat(product.price).toFixed(2)}</td>
        <td class="product-actions">
          <button class="btn-edit" onclick="editProduct('${product.id}')">Editar</button>
          <button class="btn-delete" onclick="confirmDelete('${product.id}', '${product.name}')">Eliminar</button>
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Error al cargar productos:', error);
    loadingEl.innerHTML = '<p>Error al cargar los productos.</p>';
  }
}

function openProductModal(productId = null) {
  const modal = document.getElementById('product-modal');
  const modalTitle = document.getElementById('modal-title');
  const form = document.getElementById('product-form');

  editingProductId = productId;

  if (productId) {
    modalTitle.textContent = 'Editar Producto';
    loadProductData(productId);
  } else {
    modalTitle.textContent = 'Agregar Producto';
    form.reset();
  }

  modal.style.display = 'flex';
}

function closeProductModal() {
  document.getElementById('product-modal').style.display = 'none';
  document.getElementById('product-form').reset();
  document.getElementById('form-error').style.display = 'none';
  editingProductId = null;
}

async function loadProductData(productId) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      document.getElementById('product-id').value = data.id;
      document.getElementById('product-name').value = data.name;
      document.getElementById('product-description').value = data.description || '';
      document.getElementById('product-price').value = data.price;
      document.getElementById('product-image').value = data.image_url;
    }
  } catch (error) {
    console.error('Error al cargar producto:', error);
  }
}

async function handleProductSubmit(e) {
  e.preventDefault();

  const formError = document.getElementById('form-error');
  formError.style.display = 'none';

  const productData = {
    name: document.getElementById('product-name').value,
    description: document.getElementById('product-description').value,
    price: parseFloat(document.getElementById('product-price').value),
    image_url: document.getElementById('product-image').value
  };

  try {
    if (editingProductId) {
      await updateProduct(editingProductId, productData);
    } else {
      await addProduct(productData);
    }

    closeProductModal();
    loadAdminProducts();

  } catch (error) {
    console.error('Error al guardar producto:', error);
    formError.textContent = 'Error al guardar el producto. Por favor, intenta de nuevo.';
    formError.style.display = 'block';
  }
}

function confirmDelete(productId, productName) {
  const modal = document.getElementById('delete-modal');
  const nameEl = document.getElementById('delete-product-name');

  nameEl.textContent = productName;
  modal.style.display = 'flex';
  modal.dataset.productId = productId;
}

function closeDeleteModal() {
  document.getElementById('delete-modal').style.display = 'none';
}

async function handleDelete() {
  const modal = document.getElementById('delete-modal');
  const productId = modal.dataset.productId;

  try {
    await deleteProduct(productId);
    closeDeleteModal();
    loadAdminProducts();
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    alert('Error al eliminar el producto');
  }
}

document.getElementById('login-form').addEventListener('submit', handleLogin);
document.getElementById('logout-btn').addEventListener('click', handleLogout);
document.getElementById('add-product-btn').addEventListener('click', () => openProductModal());
document.getElementById('product-form').addEventListener('submit', handleProductSubmit);

document.querySelector('.close-modal').addEventListener('click', closeProductModal);
document.querySelector('.cancel-modal').addEventListener('click', closeProductModal);

document.querySelector('.close-delete-modal').addEventListener('click', closeDeleteModal);
document.querySelector('.cancel-delete').addEventListener('click', closeDeleteModal);
document.getElementById('confirm-delete').addEventListener('click', handleDelete);

document.getElementById('product-modal').addEventListener('click', (e) => {
  if (e.target.id === 'product-modal') {
    closeProductModal();
  }
});

document.getElementById('delete-modal').addEventListener('click', (e) => {
  if (e.target.id === 'delete-modal') {
    closeDeleteModal();
  }
});

window.editProduct = openProductModal;
window.confirmDelete = confirmDelete;

checkAuth();
