'use strict';

(function(){
  try {
    const pre = document.getElementById('preloader');
    const page = document.getElementById('page');

    // TEMPORARILY DISABLED: Preloader causing performance issues
    function hidePre(immediate = false){
      if(!pre) return;
      try {
        // Immediately remove preloader to fix performance
        if(pre.parentNode) pre.parentNode.removeChild(pre);
        if(page) page.classList.remove('blurred');
      } catch(err){}
    }

    // Remove preloader immediately for better performance
    window.addEventListener('load', ()=>{ 
      try{ 
        hidePre(true); 
      } catch(e){ 
        console.error(e); 
        hidePre(true); 
      } 
    }, {once:true});

    // Remove preloader immediately if still exists
    setTimeout(()=>{ 
      if(document.getElementById('preloader')) hidePre(true); 
    }, 100);

    window.addEventListener('error', ()=>{ 
      if(document.getElementById('preloader')) hidePre(true); 
    });

  } catch(err) {
    try { 
      const pre = document.getElementById('preloader'); 
      if(pre && pre.parentNode) pre.parentNode.removeChild(pre); 
      const page = document.getElementById('page'); 
      if(page) page.classList.remove('blurred'); 
    }catch(e){}
    console.error('Preloader init failed', err);
  }
})();

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
    getBestSellers,
    openGallery: openGalleryShared,
    showToast,
    ModalManager
  } = window.TARF_UTILS;
  
  const PAGE_SIZE = 4;
  let cart = [];
  let currentPage = 1;
  let currentGalleryProduct = null;
  let currentImageIndex = 0;

  // ===== CART MANAGEMENT =====
  function addToCart(id, quantity = 1){
    cart = addToCartShared(cart, id, quantity);
    saveCartToStorage(cart);
    renderCart();
    
    const product = PRODUCTS.find(x => x.id === id);
    if (product) {
      showToast(`تم إضافة ${quantity} من ${product.name} إلى السلة`, 'success');
    }
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

  function renderCart(){
    const cartCountEl = dom('#cart-count');
    const cartItemsEl = dom('#cart-items');
    const cartSubtotalEl = dom('#cart-subtotal');
    
    renderCartShared(cart, cartCountEl, cartItemsEl, cartSubtotalEl);
    
    // Attach remove event listeners
    domAll('.remove-item').forEach(b => {
      b.addEventListener('click', (ev) => {
        const id = ev.currentTarget.getAttribute('data-id');
        removeFromCart(id);
      });
    });
  }

  // ===== SCROLL MANAGEMENT =====
  function lockScroll() {
    document.body.style.overflow = 'hidden';
  }
  
  function unlockScroll() {
    document.body.style.removeProperty('overflow');
  }
  
  // ===== GO TO TOP BUTTON =====
  function initGoToTop() {
    const goToTopBtn = dom('#go-to-top');
    if (!goToTopBtn) return;

    const progressCircle = dom('#progress-circle');
    const progressFill = dom('#progress-fill');
    
    function updateScrollProgress() {
      // FIXED: Use correct scroll position
      const scrollTop = window.pageYOffset || window.scrollY || 0;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      // Show/hide button based on scroll position
      if (scrollTop > 300) {
        goToTopBtn.classList.add('visible');
      } else {
        goToTopBtn.classList.remove('visible');
      }
      
      // Update progress circle - FIXED: Better calculation
      if (progressFill) {
        const circumference = 2 * Math.PI * 16; // radius = 16
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
    
    // Event listeners
    goToTopBtn.addEventListener('click', goToTop);
    
    // FIXED: Only update progress when gallery is not open
    function handleScroll() {
      const galleryModal = dom('#gallery-modal');
      if (galleryModal && !galleryModal.classList.contains('hidden')) {
        // Gallery is open, don't update progress
        return;
      }
      updateScrollProgress();
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call
    updateScrollProgress();
  }
  
  // ===== MODAL MANAGEMENT =====
  const modalManager = new ModalManager();

  // ===== HEADER SCROLL EFFECT =====
  function initHeaderScroll() {
    const header = dom('.site-header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    
    function handleScroll() {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScrollY = currentScrollY;
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // ===== MOBILE MENU =====
  const preloadImg = new Image();
  preloadImg.src = "imgs/spark.png";
  const mobileBtn = dom('#mobile-menu-btn');
  const mobileMenu = dom('#mobile-menu');
  const icon = mobileBtn.querySelector("i");
  
  function swapIcon(oldIcon, newIcon) {
    icon.classList.add("fade-out");
  
    const handleEnd = () => {
      icon.classList.remove("fade-out");
  
      if (newIcon === "spa-image") {
        icon.className = "";
        icon.innerHTML = `<img src="imgs/spark.png" alt="" style="width:30px; height:30px;" />`;
      } else {
        icon.innerHTML = ""; 
        icon.className = `fas ${newIcon} fade-in`;  
      }
  
      icon.addEventListener("transitionend", () => {
        icon.classList.remove("fade-in");
      }, { once: true });
  
      icon.removeEventListener("transitionend", handleEnd);
    };
  
    icon.addEventListener("transitionend", handleEnd, { once: true });
  }
  
  if (mobileBtn && mobileMenu) {
    const openMobileMenu = () => {
      mobileBtn.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
      mobileMenu.classList.remove('hidden');
      void mobileMenu.offsetHeight;
      mobileMenu.classList.add('open');
  
      if (icon.classList.contains("fa-bars")) {
        swapIcon("fa-bars", "spa-image");
      }
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
  
      if (icon.innerHTML.includes("img")) {
        swapIcon("spa-image", "fa-bars");
      }
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

  // ===== CART EVENT LISTENERS =====
  const cartBtn = dom('#cart-btn');
  const cartDropdown = dom('#cart-dropdown');
  const closeCart = dom('#close-cart');
  const cartCountEl = dom('#cart-count');
  const cartItemsEl = dom('#cart-items');
  const cartSubtotalEl = dom('#cart-subtotal');
  const checkoutBtn = dom('#checkout-btn');
  const checkoutModal = dom('#checkout-modal');
  const closeCheckout = dom('#close-checkout');
  const placeOrder = dom('#place-order');
  const nameInput = dom('#checkout-name');
  const phoneInput = dom('#checkout-phone');
  const addressInput = dom('#checkout-address');

  if(cartBtn && cartDropdown){
    cartBtn.addEventListener('click', (e)=>{ 
      e.stopPropagation(); 
      const isExpanded = cartBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        modalManager.close(cartDropdown);
      } else {
        modalManager.open(cartDropdown, cartBtn);
      }
    });
    
    document.addEventListener('click', (e)=>{ 
      if(cartDropdown && !cartDropdown.contains(e.target) && !cartBtn.contains(e.target)) {
        modalManager.close(cartDropdown);
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !cartDropdown.classList.contains('hidden')) {
        modalManager.close(cartDropdown);
      }
    });
  }
  
  if(closeCart && cartDropdown) {
    closeCart.addEventListener('click', ()=> modalManager.close(cartDropdown));
  }

  // ===== PRODUCTS MANAGEMENT =====
  const productsGrid = dom('#products-grid');
  const pagerEl = dom('#pager');

  function renderProductsPage(page=1, pageSize=PAGE_SIZE){
    const items = getBestSellers();
    const total = items.length; 
    const pages = Math.max(1, Math.ceil(total/pageSize));
    if(page>pages) page=pages; 
    currentPage=page;
    const start = (page-1)*pageSize; 
    const chunk = items.slice(start, start+pageSize);
    if(!productsGrid) return;
    productsGrid.innerHTML = '';
    chunk.forEach(p=>{
      const card = createProductCard(p);
      productsGrid.appendChild(card);
    });
    renderPager(pages, page);
    attachProductEventListeners();
  }

  function renderPager(totalPages, active){
    if(!pagerEl) return;
    pagerEl.innerHTML='';
    if(totalPages<=1) return;
    for(let i=1;i<=totalPages;i++){
      const btn = document.createElement('button'); 
      btn.textContent=i; 
      if(i===active) btn.className='active';
      btn.setAttribute('aria-label', `الصفحة ${i}`);
      btn.addEventListener('click', ()=>renderProductsPage(i));
      pagerEl.appendChild(btn);
    }
  }

  function attachProductEventListeners() {
    // Product image click for gallery
    domAll('.product-media').forEach(media => {
      media.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const productId = e.currentTarget.getAttribute('data-product-id');
        openGallery(productId);
      });
    });
    
    // Quantity buttons
    domAll('.btn-quantity').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
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
        e.preventDefault();
        e.stopPropagation();
        const productId = e.currentTarget.getAttribute('data-product-id');
        const quantityEl = dom(`[data-product-id="${productId}"].quantity-display`);
        const quantity = parseInt(quantityEl.textContent) || 1;
        
        addToCart(productId, quantity);
      });
    });
  }

  function getProductName(id) {
    const product = PRODUCTS.find(p => p.id === id);
    return product ? product.name : 'المنتج';
  }

  // ===== GALLERY FUNCTIONALITY =====
  function openGallery(productId) {
    openGalleryShared(productId, modalManager);
  }

  // ===== GALLERY EVENT LISTENERS =====
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const galleryModal = dom('#gallery-modal');
      if (galleryModal && !galleryModal.classList.contains('hidden')) {
        modalManager.close(galleryModal);
      }
    }
    
    if (e.key === 'ArrowLeft') {
      const galleryModal = dom('#gallery-modal');
      if (galleryModal && !galleryModal.classList.contains('hidden')) {
        window.prevImage();
      }
    }
    
    if (e.key === 'ArrowRight') {
      const galleryModal = dom('#gallery-modal');
      if (galleryModal && !galleryModal.classList.contains('hidden')) {
        window.nextImage();
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('gallery-prev')) {
      e.preventDefault();
      e.stopPropagation();
      window.prevImage();
    }
    
    if (e.target.classList.contains('gallery-next')) {
      e.preventDefault();
      e.stopPropagation();
      window.nextImage();
    }
    
    if (e.target.classList.contains('gallery-close')) {
      e.preventDefault();
      e.stopPropagation();
      const galleryModal = dom('#gallery-modal');
      if (galleryModal) {
        modalManager.close(galleryModal);
      }
    }
  });

  // ===== CHECKOUT FUNCTIONALITY =====
  if(checkoutBtn && checkoutModal && cartSubtotalEl){
    checkoutBtn.addEventListener('click', ()=> { 
      if(cart.length===0) return; 
      modalManager.open(checkoutModal, nameInput);
      const subtotal = cart.reduce((s,i)=>s+i.price*i.quantity,0); 
      const co = dom('#checkout-subtotal'); 
      if(co) co.textContent = subtotal.toFixed(2) + ' EGP'; 
    });
  }
  
  if(closeCheckout) {
    closeCheckout.addEventListener('click', ()=> modalManager.close(checkoutModal));
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!checkoutModal.classList.contains('hidden')) {
        modalManager.close(checkoutModal);
      }
    }
  });

  if(placeOrder){
    placeOrder.addEventListener('click', (e)=>{
      e.preventDefault();
      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const address = addressInput ? addressInput.value.trim() : '';
      if(!name || !phone || !address) {
        showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
      }
      
      let msg = '*طلب جديد من Tarf Beauty*%0A%0A';
      msg += '*البيانات*%0A';
      msg += 'الاسم: ' + name + '%0A';
      msg += 'الهاتف: ' + phone + '%0A';
      msg += 'العنوان: ' + address.replace(/\n/g,'%0A') + '%0A%0A';
      msg += '*المنتجات*%0A';
      cart.forEach(i=> msg += `- ${i.name} x ${i.quantity} (${i.price.toFixed(2)} EGP)%0A`);
      const subtotal = cart.reduce((s,i)=>s+i.price*i.quantity,0);
      msg += '%0A*المجموع:* ' + subtotal.toFixed(2) + ' EGP';
      window.open('https://wa.me/201020572730?text=' + msg, '_blank');
      
      modalManager.close(checkoutModal);
      
      cart = [];
      clearCartStorage();
      renderCart();
      
      if(nameInput) nameInput.value = '';
      if(phoneInput) phoneInput.value = '';
      if(addressInput) addressInput.value = '';
      
      showToast('تم إرسال طلبك بنجاح!', 'success');
    });
  }

  if (checkoutModal) {
    checkoutModal.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        e.preventDefault();
        const nextInput = e.target.nextElementSibling?.querySelector('input, textarea');
        if (nextInput) {
          nextInput.focus();
        } else {
          placeOrder.click();
        }
      }
    });
  }

  // ===== PREVENT UNWANTED SCROLLING =====
  function preventUnwantedScrolling() {
    // Prevent any default link behaviors that might cause scrolling
    document.addEventListener('click', (e) => {
      // Only prevent default for empty links or hash links
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
      // If clicking on empty space (body or main), don't scroll
      if (e.target === document.body || e.target === document.querySelector('main')) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    // Prevent any unwanted scroll behaviors
    document.addEventListener('scroll', (e) => {
      // Only allow intentional scrolling
      if (!e.isTrusted) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, { passive: false });
  }

  // ===== INITIALIZATION =====
  cart = loadCartFromStorage();
  renderProductsPage(1, PAGE_SIZE);
  renderCart();
  initHeaderScroll();
  initGoToTop();
  preventUnwantedScrolling();

  window.addEventListener('beforeunload', () => {
    saveCartToStorage(cart);
    modalManager.closeAll();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      saveCartToStorage(cart);
    }
  });
});
