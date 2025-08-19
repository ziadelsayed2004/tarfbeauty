'use strict';

document.addEventListener('DOMContentLoaded', function(){
  'use strict';

  // ===== USE SHARED PRODUCTS DATA =====
  const PRODUCTS = window.TARF_PRODUCTS;
  const { 
    dom, 
    domAll, 
    saveCartToStorage, 
    loadCartFromStorage, 
    clearCartStorage, 
    getCartItemCount,
    createProductCard,
    addToCart: addToCartShared,
    removeFromCart: removeFromCartShared,
    updateCartQuantity: updateCartQuantityShared,
    renderCart: renderCartShared,
    filterProducts,
    openGallery: openGalleryShared,
    showToast,
    ModalManager
  } = window.TARF_UTILS;

  const PAGE_SIZE = 6;
  let currentPage = 1;
  let filteredProducts = [...PRODUCTS];
  let currentFilters = { category: 'all', price: 'all' };
  let cart = [];

  // ===== CART MANAGEMENT =====
  function addToCart(id, quantity = 1) {
    cart = addToCartShared(cart, id, quantity);
    saveCartToStorage(cart);
    renderCart();
  }
  
  function removeFromCart(id) {
    const item = cart.find(i => i.id === id);
    cart = removeFromCartShared(cart, id);
    
    saveCartToStorage(cart);
    renderCart();
    
    if (item) {
      showToast(`تم حذف ${item.name} من السلة`, 'info');
    }
  }
  
  function updateCartQuantity(id, quantity) {
    cart = updateCartQuantityShared(cart, id, quantity);
    saveCartToStorage(cart);
    renderCart();
  }
  
  function renderCart() {
    const cartCountEl = dom('#cart-count');
    const cartItemsEl = dom('#cart-items');
    const cartSubtotalEl = dom('#cart-subtotal');
    
    renderCartShared(cart, cartCountEl, cartItemsEl, cartSubtotalEl);
    
    // Attach remove event listeners
    domAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        removeFromCart(id);
      });
    });
  }

  // ===== MODAL MANAGEMENT =====
  const modalManager = new ModalManager();

  // ===== FILTER FUNCTIONALITY =====
  function applyFilters() {
    filteredProducts = filterProducts(currentFilters.category, currentFilters.price);
    currentPage = 1;
    renderProducts();
    updateProductsCount();
  }
  
  function updateProductsCount() {
    const countEl = dom('#products-count');
    if (countEl) {
      countEl.textContent = filteredProducts.length;
    }
  }

  // ===== PRODUCT RENDERING =====
  function renderProducts() {
    const productsGrid = dom('#products-grid');
    if (!productsGrid) return;
    
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageProducts = filteredProducts.slice(start, end);
    
    productsGrid.innerHTML = '';
    
    pageProducts.forEach(product => {
      const productCard = createProductCard(product);
      productsGrid.appendChild(productCard);
    });
    
    renderPager();
    attachProductEventListeners();
  }
  
  function renderPager() {
    const pagerEl = dom('#pager');
    if (!pagerEl) return;
    
    const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
    pagerEl.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      if (i === currentPage) btn.className = 'active';
      btn.setAttribute('aria-label', `الصفحة ${i}`);
      btn.addEventListener('click', () => {
        currentPage = i;
        renderProducts();
      });
      pagerEl.appendChild(btn);
    }
  }
  
  function attachProductEventListeners() {
    domAll('.product-media').forEach(media => {
      media.addEventListener('click', (e) => {
        const productId = e.currentTarget.getAttribute('data-product-id');
        openGallery(productId);
      });
    });
    
    // Quantity buttons
    domAll('.btn-quantity').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = e.currentTarget.getAttribute('data-product-id');
        const action = e.currentTarget.getAttribute('data-action');
        const quantityEl = dom(`[data-product-id="${productId}"].quantity-display`);
        
        if (quantityEl) {
          let currentQty = parseInt(quantityEl.textContent) || 1;
          
          if (action === 'increase') {
            currentQty++;
          } else if (action === 'decrease') {
            currentQty = Math.max(1, currentQty - 1);
          }
          
          quantityEl.textContent = currentQty;
        }
      });
    });
    
    // Add to cart buttons
    domAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = e.currentTarget.getAttribute('data-product-id');
        const quantityEl = dom(`[data-product-id="${productId}"].quantity-display`);
        const quantity = parseInt(quantityEl.textContent) || 1;
        
        addToCart(productId, quantity);
        showToast(`تم إضافة المنتج إلى السلة بنجاح`, 'success');
      });
    });
  }

  // ===== GALLERY FUNCTIONALITY =====
  function openGallery(productId) {
    openGalleryShared(productId, modalManager);
  }

  // ===== EVENT LISTENERS =====
  function attachEventListeners() {
    // Filter buttons
    domAll('.filter-btn[data-category]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        domAll('.filter-btn[data-category]').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        currentFilters.category = e.currentTarget.getAttribute('data-category');
        applyFilters();
      });
    });
    
    domAll('.filter-btn[data-price]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        domAll('.filter-btn[data-price]').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        currentFilters.price = e.currentTarget.getAttribute('data-price');
        applyFilters();
      });
    });
    
    // Cart functionality
    const cartBtn = dom('#cart-btn');
    const cartDropdown = dom('#cart-dropdown');
    const closeCart = dom('#close-cart');
    
    if (cartBtn && cartDropdown) {
      cartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = cartBtn.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          modalManager.close(cartDropdown);
        } else {
          modalManager.open(cartDropdown, cartBtn);
        }
      });
      
      document.addEventListener('click', (e) => {
        if (cartDropdown && !cartDropdown.contains(e.target) && !cartBtn.contains(e.target)) {
          modalManager.close(cartDropdown);
        }
      });
    }
    
    if (closeCart && cartDropdown) {
      closeCart.addEventListener('click', () => modalManager.close(cartDropdown));
    }
    
    // Checkout functionality
    const checkoutBtn = dom('#checkout-btn');
    const checkoutModal = dom('#checkout-modal');
    const closeCheckout = dom('#close-checkout');
    const placeOrder = dom('#place-order');
    
    if (checkoutBtn && checkoutModal) {
      checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
          showToast('السلة فارغة', 'warning');
          return;
        }
        modalManager.open(checkoutModal);
        updateCheckoutSubtotal();
      });
    }
    
    if (closeCheckout && checkoutModal) {
      closeCheckout.addEventListener('click', () => modalManager.close(checkoutModal));
    }
    
    if (placeOrder) {
      placeOrder.addEventListener('click', (e) => {
        e.preventDefault();
        const name = dom('#checkout-name')?.value.trim();
        const phone = dom('#checkout-phone')?.value.trim();
        const address = dom('#checkout-address')?.value.trim();
        
        if (!name || !phone || !address) {
          showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
          return;
        }
        
        // Create WhatsApp message
        let msg = '*طلب جديد من Tarf Beauty*%0A%0A';
        msg += '*البيانات*%0A';
        msg += 'الاسم: ' + name + '%0A';
        msg += 'الهاتف: ' + phone + '%0A';
        msg += 'العنوان: ' + address.replace(/\n/g,'%0A') + '%0A%0A';
        msg += '*المنتجات*%0A';
        cart.forEach(item => msg += `- ${item.name} x ${item.quantity} (${item.price.toFixed(2)} EGP)%0A`);
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        msg += '%0A*المجموع:* ' + subtotal.toFixed(2) + ' EGP';
        
        window.open('https://wa.me/201020572730?text=' + msg, '_blank');
        
        modalManager.close(checkoutModal);
        cart = [];
        renderCart();
        
        // Reset form
        if (dom('#checkout-name')) dom('#checkout-name').value = '';
        if (dom('#checkout-phone')) dom('#checkout-phone').value = '';
        if (dom('#checkout-address')) dom('#checkout-address').value = '';
        
        showToast('تم إرسال طلبك بنجاح!', 'success');
      });
    }
    
    // Gallery navigation
    const galleryPrev = dom('.gallery-prev');
    const galleryNext = dom('.gallery-next');
    const galleryClose = dom('.gallery-close');
    
    if (galleryPrev) galleryPrev.addEventListener('click', window.prevImage);
    if (galleryNext) galleryNext.addEventListener('click', window.nextImage);
    if (galleryClose) galleryClose.addEventListener('click', () => modalManager.close(dom('#gallery-modal')));
    
    // Keyboard navigation for gallery
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!dom('#gallery-modal').classList.contains('hidden')) {
          modalManager.close(dom('#gallery-modal'));
        }
        if (!dom('#checkout-modal').classList.contains('hidden')) {
          modalManager.close(dom('#checkout-modal'));
        }
      }
      
      if (e.key === 'ArrowLeft') {
        if (!dom('#gallery-modal').classList.contains('hidden')) {
          window.prevImage();
        }
      }
      
      if (e.key === 'ArrowRight') {
        if (!dom('#gallery-modal').classList.contains('hidden')) {
          window.nextImage();
        }
      }
    });
    
    // Mobile menu
    const mobileBtn = dom('#mobile-menu-btn');
    const mobileMenu = dom('#mobile-menu');
    
    if (mobileBtn && mobileMenu) {
      const openMobileMenu = () => {
        mobileBtn.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
        mobileMenu.classList.remove('hidden');
        void mobileMenu.offsetHeight;
        mobileMenu.classList.add('open');
        const firstLink = mobileMenu.querySelector('.mobile-link');
        if (firstLink) firstLink.focus();
      };
      const closeMobileMenu = () => {
        mobileBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenu.classList.remove('open');
        const handleEnd = () => {
          mobileMenu.classList.add('hidden');
          mobileMenu.removeEventListener('transitionend', handleEnd);
        };
        mobileMenu.addEventListener('transitionend', handleEnd);
      };
      mobileBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('open');
        if (isOpen) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });
    }
  }
  
  function updateCheckoutSubtotal() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const checkoutSubtotal = dom('#checkout-subtotal');
    if (checkoutSubtotal) {
      checkoutSubtotal.textContent = subtotal.toFixed(2) + ' EGP';
    }
  }

  // ===== GO TO TOP BUTTON =====
  function initGoToTop() {
    const goToTopBtn = dom('#go-to-top');
    if (!goToTopBtn) return;

    const progressCircle = dom('#progress-circle');
    const progressFill = dom('#progress-fill');
    
    function updateScrollProgress() {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      if (scrollTop > 300) {
        goToTopBtn.classList.add('visible');
      } else {
        goToTopBtn.classList.remove('visible');
      }
      
      if (progressFill) {
        const circumference = 2 * Math.PI * 16;
        const progress = (scrollPercent / 100) * circumference;
        progressFill.style.strokeDasharray = `${progress} ${circumference}`;
      }
    }
    
    function goToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    
    goToTopBtn.addEventListener('click', goToTop);
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    
    updateScrollProgress();
  }

  // ===== PREVENT UNWANTED SCROLLING =====
  function preventUnwantedScrolling() {
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        const href = e.target.getAttribute('href');
        if (href === '#' || href === '') {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    });

    // Prevent scroll on empty areas
    document.addEventListener('click', (e) => {
      if (e.target === document.body || e.target === document.querySelector('main')) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    // Prevent any unwanted scroll behaviors
    document.addEventListener('scroll', (e) => {
      if (!e.isTrusted) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, { passive: false });
  }

  // ===== FILTER TOGGLE FUNCTIONALITY =====
  function initFilterToggles() {
    const filterToggles = domAll('.filter-toggle');
    
    filterToggles.forEach(toggle => {
      toggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        const targetId = this.getAttribute('aria-controls');
        const targetOptions = dom(`#${targetId}`);
        
        this.setAttribute('aria-expanded', !isExpanded);
        
        if (targetOptions) {
          if (isExpanded) {
            targetOptions.classList.remove('show');
          } else {
            targetOptions.classList.add('show');
          }
        }
      });
    });
  }

  // ===== INITIALIZATION =====
  function init() {
    cart = loadCartFromStorage();
    
    renderProducts();
    renderCart();
    attachEventListeners();
    updateProductsCount();
    initFilterToggles();
    initGoToTop();
  }

  init();
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    saveCartToStorage(cart);
    modalManager.closeAll();
  });

  // Save cart when page becomes hidden
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      saveCartToStorage(cart);
    }
  });
}); 