'use strict';

// ===== SHARED PRODUCTS DATA =====
const PRODUCTS = [
  {
    id: 'face-1',
    name: 'مطهر الوجه الطبيعي',
    price: 180,
    old: 250,
    category: 'face',
    bestseller: true,
    description: 'مطهر طبيعي للوجه يزيل الأوساخ والزيوت الزائدة، مناسب لجميع أنواع البشرة',
    images: ['imgs/Products/P1/1.jpg', 'imgs/Products/P1/2.jpg', 'imgs/Products/P1/3.jpg'],
    features: ['طبيعي 100%', 'مناسب للبشرة الحساسة', 'يحتوي على فيتامين E'],
    ingredients: 'ماء، زيت جوز الهند، زيت اللافندر، فيتامين E'
  },
  {
    id: 'face-2',
    name: 'كريم الترطيب اليومي',
    price: 220,
    old: 300,
    category: 'face',
    bestseller: true,
    description: 'كريم ترطيب خفيف يمنح البشرة الترطيب العميق طوال اليوم',
    images: ['imgs/TarfSq.png', 'imgs/TarfSq.png', 'imgs/TarfSq.png'],
    features: ['ترطيب عميق', 'ملمس خفيف', 'لا يترك بقايا'],
    ingredients: 'ماء، زيت الأرغان، زبدة الشيا، حمض الهيالورونيك'
  },
  {
    id: 'face-3',
    name: 'مقشر البشرة اللطيف',
    price: 150,
    old: 200,
    category: 'face',
    bestseller: false,
    description: 'مقشر طبيعي لطيف يزيل الخلايا الميتة وينعش البشرة',
    images: ['imgs/TarfSq.png', 'imgs/TarfSq.png', 'imgs/TarfSq.png'],
    features: ['طبيعي 100%', 'لطيف على البشرة', 'نتائج فورية'],
    ingredients: 'سكر البني، زيت جوز الهند، زيت اللافندر، زيت النعناع'
  },
  {
    id: 'hair-1',
    name: 'شامبو الشعر الطبيعي',
    price: 160,
    old: 220,
    category: 'hair',
    bestseller: true,
    description: 'شامبو طبيعي ينظف الشعر بلطف ويحافظ على رطوبته الطبيعية',
    images: ['imgs/TarfSq.png', 'imgs/TarfSq.png', 'imgs/TarfSq.png'],
    features: ['طبيعي 100%', 'يناسب جميع أنواع الشعر', 'لا يحتوي على كبريتات'],
    ingredients: 'ماء، زيت جوز الهند، زيت الأرغان، زيت اللافندر'
  },
  {
    id: 'hair-2',
    name: 'بلسم الشعر المغذي',
    price: 140,
    old: 180,
    category: 'hair',
    bestseller: false,
    description: 'بلسم مغذي يمنح الشعر النعومة واللمعان الطبيعي',
    images: ['imgs/TarfSq.png', 'imgs/TarfSq.png', 'imgs/TarfSq.png'],
    features: ['مغذي عميق', 'نعومة فورية', 'لمعان طبيعي'],
    ingredients: 'ماء، زيت الأرغان، زبدة الشيا، زيت اللافندر'
  },
  {
    id: 'body-1',
    name: 'صابونة الجسم الطبيعية',
    price: 80,
    old: 120,
    category: 'body',
    bestseller: false,
    description: 'صابونة طبيعية للجسم تنعش البشرة وتتركها ناعمة',
    images: ['imgs/TarfSq.png', 'imgs/TarfSq.png', 'imgs/TarfSq.png'],
    features: ['طبيعي 100%', 'رائحة منعشة', 'مناسب للبشرة الحساسة'],
    ingredients: 'زيت جوز الهند، زيت الزيتون، زيت اللافندر، زيت النعناع'
  },
  {
    id: 'body-2',
    name: 'كريم الجسم المرطب',
    price: 190,
    old: 250,
    category: 'body',
    bestseller: false,
    description: 'كريم مرطب للجسم يمنح البشرة النعومة والترطيب العميق',
    images: ['imgs/TarfSq.png', 'imgs/TarfSq.png', 'imgs/TarfSq.png'],
    features: ['ترطيب عميق', 'ملمس خفيف', 'رائحة منعشة'],
    ingredients: 'ماء، زيت الأرغان، زبدة الشيا، زيت اللافندر'
  },
  {
    id: 'makeup-1',
    name: 'أحمر الشفاه الطبيعي',
    price: 120,
    old: 160,
    category: 'makeup',
    bestseller: false,
    description: 'أحمر شفاه طبيعي بألوان جميلة وملمس ناعم',
    images: ['imgs/TarfSq.png', 'imgs/TarfSq.png', 'imgs/TarfSq.png'],
    features: ['طبيعي 100%', 'ألوان جميلة', 'ملمس ناعم'],
    ingredients: 'زيت جوز الهند، شمع العسل، زيت الأرغان، ألوان طبيعية'
  },
  {
    id: 'makeup-2',
    name: 'كحل العين الطبيعي',
    price: 90,
    old: 130,
    category: 'makeup',
    bestseller: false,
    description: 'كحل طبيعي للعين يعطي مظهراً جذاباً وآمناً',
    images: ['imgs/TarfSq.png', 'imgs/TarfSq.png', 'imgs/TarfSq.png'],
    features: ['طبيعي 100%', 'مقاوم للماء', 'سهل الإزالة'],
    ingredients: 'فحم نباتي، زيت جوز الهند، زيت اللافندر'
  }
];

// ===== SHARED UTILITY FUNCTIONS =====
function dom(q) { return document.querySelector(q); }
function domAll(q) { return Array.from(document.querySelectorAll(q)); }

// ===== SHARED CART STORAGE MANAGEMENT =====
const CART_STORAGE_KEY = 'tarf_cart';
const CART_EXPIRY_KEY = 'tarf_cart_expiry';
const CART_EXPIRY_DAYS = 30;

function saveCartToStorage(cart) {
  try {
    const cartData = {
      items: cart,
      timestamp: Date.now(),
      expiry: Date.now() + (CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
    localStorage.setItem(CART_EXPIRY_KEY, cartData.expiry.toString());
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
}

function loadCartFromStorage() {
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    const expiry = localStorage.getItem(CART_EXPIRY_KEY);
    
    if (cartData && expiry) {
      const parsedData = JSON.parse(cartData);
      const now = Date.now();
      
      if (now < parsedData.expiry) {
        return parsedData.items || [];
      } else {
        clearCartStorage();
        return [];
      }
    }
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
  }
  return [];
}

function clearCartStorage() {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(CART_EXPIRY_KEY);
  } catch (error) {
    console.error('Failed to clear cart storage:', error);
  }
}

function getCartItemCount(cart) {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

// ===== SHARED PRODUCT CARD CREATION =====
function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  
  const badge = product.bestseller ? '<div class="product-badge">الأكثر مبيعاً</div>' : '';
  
  card.innerHTML = `
    ${badge}
    <div class="product-media" data-product-id="${product.id}">
      <img src="${product.images[0]}" loading="lazy" alt="${product.name}" width="400" height="280">
    </div>
    <div class="product-body">
      <h3 class="product-title">${product.name}</h3>
      <p class="product-desc">${product.description}</p>
      <div class="product-meta">
        <div class="product-price">
          <s>${product.old} EGP</s>
          <strong>${product.price} EGP</strong>
        </div>
        <div class="product-actions">
          <button class="btn-quantity" data-product-id="${product.id}" data-action="decrease" aria-label="تقليل الكمية">-</button>
          <span class="quantity-display" data-product-id="${product.id}">1</span>
          <button class="btn-quantity" data-product-id="${product.id}" data-action="increase" aria-label="زيادة الكمية">+</button>
          <button class="add-to-cart-btn" data-product-id="${product.id}" aria-label="إضافة ${product.name} للسلة">
            إضافة للسلة
          </button>
        </div>
      </div>
    </div>
  `;
  
  return card;
}

// ===== SHARED CART FUNCTIONS =====
function addToCart(cart, productId, quantity = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return cart;
  
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0]
    });
  }
  
  return cart;
}

function removeFromCart(cart, productId) {
  return cart.filter(item => item.id !== productId);
}

function updateCartQuantity(cart, productId, quantity) {
  if (quantity <= 0) {
    return removeFromCart(cart, productId);
  }
  
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = quantity;
  }
  
  return cart;
}

function renderCart(cart, cartCountEl, cartItemsEl, cartSubtotalEl) {
  if (!cartCountEl || !cartItemsEl || !cartSubtotalEl) return;
  
  const totalItems = getCartItemCount(cart);
  cartCountEl.textContent = totalItems;
  
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="empty" id="cart-description">السلة فارغة</p>';
    cartSubtotalEl.textContent = '0.00 EGP';
    return;
  }
  
  const description = `السلة تحتوي على ${totalItems} منتج`;
  cartItemsEl.setAttribute('aria-label', description);
  
  let subtotal = 0;
  cartItemsEl.innerHTML = '';
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div>
        <div style="font-weight:600">${item.name}</div>
        <div style="font-size:13px;color:var(--muted)">${item.price} EGP x ${item.quantity}</div>
      </div>
      <div>
        <div style="font-weight:700;margin-bottom:6px">${itemTotal.toFixed(2)} EGP</div>
        <div>
          <button class="remove-item" data-id="${item.id}" aria-label="حذف ${item.name}">حذف</button>
        </div>
      </div>
    `;
    
    cartItemsEl.appendChild(cartItem);
  });
  
  cartSubtotalEl.textContent = subtotal.toFixed(2) + ' EGP';
}

// ===== SHARED PRODUCT FILTERING =====
function getBestSellers() {
  return PRODUCTS.filter(p => p.bestseller);
}

function filterProducts(category = 'all', price = 'all') {
  return PRODUCTS.filter(product => {
    const categoryMatch = category === 'all' || product.category === category;
    
    let priceMatch = true;
    if (price !== 'all') {
      const [min, max] = price.split('-').map(p => p === '+' ? Infinity : Number(p));
      priceMatch = product.price >= min && (max === Infinity ? true : product.price <= max);
    }
    
    return categoryMatch && priceMatch;
  });
}

// ===== SHARED GALLERY FUNCTIONS =====
function openGallery(productId, modalManager) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  
  const galleryModal = dom('#gallery-modal');
  const galleryMain = dom('#gallery-main');
  const galleryThumbnails = dom('#gallery-thumbnails');
  
  if (galleryModal && galleryMain && galleryThumbnails) {
    window.currentGalleryProduct = product;
    window.currentImageIndex = 0;
    
    updateGalleryImage();
    renderGalleryThumbnails();
    modalManager.open(galleryModal);
  }
}

function updateGalleryImage() {
  if (!window.currentGalleryProduct) return;
  
  const galleryMain = dom('#gallery-main');
  if (galleryMain) {
    galleryMain.src = window.currentGalleryProduct.images[window.currentImageIndex];
    galleryMain.alt = `${window.currentGalleryProduct.name} - صورة ${window.currentImageIndex + 1}`;
  }
}

function renderGalleryThumbnails() {
  if (!window.currentGalleryProduct) return;
  
  const galleryThumbnails = dom('#gallery-thumbnails');
  if (!galleryThumbnails) return;
  
  galleryThumbnails.innerHTML = '';
  
  window.currentGalleryProduct.images.forEach((image, index) => {
    const thumb = document.createElement('img');
    thumb.src = image;
    thumb.alt = `${window.currentGalleryProduct.name} - صورة مصغرة ${index + 1}`;
    thumb.className = `gallery-thumb ${index === window.currentImageIndex ? 'active' : ''}`;
    thumb.addEventListener('click', () => {
      window.currentImageIndex = index;
      updateGalleryImage();
      updateGalleryThumbnails();
    });
    
    galleryThumbnails.appendChild(thumb);
  });
}

function updateGalleryThumbnails() {
  domAll('.gallery-thumb').forEach((thumb, index) => {
    thumb.classList.toggle('active', index === window.currentImageIndex);
  });
}

function nextImage() {
  if (!window.currentGalleryProduct) return;
  
  window.currentImageIndex = (window.currentImageIndex + 1) % window.currentGalleryProduct.images.length;
  updateGalleryImage();
  updateGalleryThumbnails();
}

function prevImage() {
  if (!window.currentGalleryProduct) return;
  
  window.currentImageIndex = window.currentImageIndex === 0 ? 
    window.currentGalleryProduct.images.length - 1 : 
    window.currentImageIndex - 1;
  updateGalleryImage();
  updateGalleryThumbnails();
}

// ===== SHARED TOAST SYSTEM =====
function showToast(message, type = 'success') {
  const toast = dom('#success-toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.className = `toast ${type}`;
  
  toast.classList.remove('hidden');
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// ===== SHARED MODAL MANAGER =====
class ModalManager {
  constructor() {
    this.activeModals = [];
    this.focusHistory = [];
  }
  
  open(modal, focusElement = null) {
    if (this.activeModals.length === 0) {
      this.focusHistory.push(document.activeElement);
      this.lockScroll();
    }
    
    this.activeModals.push(modal);
    modal.classList.remove('hidden');
    
    if (focusElement) {
      focusElement.focus();
    } else {
      const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) firstFocusable.focus();
    }
    
    modal.setAttribute('aria-hidden', 'false');
    const trigger = document.querySelector(`[aria-controls="${modal.id}"]`);
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  }
  
  close(modal) {
    const index = this.activeModals.indexOf(modal);
    if (index > -1) {
      this.activeModals.splice(index, 1);
    }
    
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    
    if (this.activeModals.length === 0) {
      this.unlockScroll();
      if (this.focusHistory.length > 0) {
        const lastFocus = this.focusHistory.pop();
        if (lastFocus && lastFocus.focus) {
          lastFocus.focus();
        }
      }
    }
    
    const trigger = document.querySelector(`[aria-controls="${modal.id}"]`);
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }
  
  closeAll() {
    this.activeModals.forEach(modal => this.close(modal));
  }
  
  lockScroll() {
    document.body.style.overflow = 'hidden';
  }
  
  unlockScroll() {
    document.body.style.removeProperty('overflow');
  }
}

// ===== EXPORT FOR USE IN OTHER FILES =====
window.TARF_PRODUCTS = PRODUCTS;
window.TARF_UTILS = {
  dom,
  domAll,
  saveCartToStorage,
  loadCartFromStorage,
  clearCartStorage,
  getCartItemCount,
  createProductCard,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  renderCart,
  getBestSellers,
  filterProducts,
  openGallery,
  updateGalleryImage,
  renderGalleryThumbnails,
  updateGalleryThumbnails,
  nextImage,
  prevImage,
  showToast,
  ModalManager
};
