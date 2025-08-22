'use strict';

document.addEventListener("DOMContentLoaded", () => {
  function applyLazyBlur(img, observer) {
    const realSrc = img.getAttribute("src");
    if (realSrc) {
      img.setAttribute("data-src", realSrc);
      img.removeAttribute("src");
      img.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      observer.observe(img);
    }
  }

  function initLazyBlur() {
    const style = document.createElement("style");
    style.innerHTML = `
      img.lazy-blur {
        filter: blur(12px);
        opacity: 0.75;
        transition: all 0.75s ease;
      }
      img.lazy-blur.loaded {
        filter: blur(0);
        opacity: 1;
      }
    `;
    document.head.appendChild(style);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const realSrc = img.getAttribute("data-src");

          if (realSrc) {
            img.classList.add("lazy-blur");

            const tempImg = new Image();
            tempImg.src = realSrc;

            tempImg.onload = () => {
              img.src = realSrc;
              img.classList.add("loaded");
            };
          }

          observer.unobserve(img);
        }
      });
    });

    function isExcluded(img) {
      return (
        img.closest("header") ||
        img.closest("footer") ||
        img.closest("#preloader")
      );
    }

    document.querySelectorAll("img").forEach((img) => {
      if (!isExcluded(img)) {
        applyLazyBlur(img, observer);
      }
    });

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === "IMG" && !isExcluded(node)) {
            applyLazyBlur(node, observer);
          } else if (node.querySelectorAll) {
            node.querySelectorAll("img").forEach((img) => {
              if (!isExcluded(img)) {
                applyLazyBlur(img, observer);
              }
            });
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  initLazyBlur();
});

document.addEventListener("DOMContentLoaded", function () {
  const preloader = document.createElement("div");
  const wrapper = document.createElement("div");
  const img = document.createElement("img");
  const page = document.querySelector(".page");

  preloader.style.position = "fixed";
  preloader.style.top = "0";
  preloader.style.left = "0";
  preloader.style.width = "100%";
  preloader.style.height = "100%";
  preloader.style.background = "rgba(255,255,255,0)";
  preloader.style.display = "flex";
  preloader.style.alignItems = "center";
  preloader.style.justifyContent = "center";
  preloader.style.zIndex = "9999";

  wrapper.style.position = "relative";
  wrapper.style.width = "100px";
  wrapper.style.height = "100px";
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.justifyContent = "center";

  img.src = "imgs/TarfBg.png";
  img.style.width = "95px";
  img.style.height = "95px";
  img.style.boxShadow = "0 0 20px rgb(57, 59, 101)";
  img.style.borderRadius = "50%";
  img.style.zIndex = "2";

  const spinner = document.createElement("div");
  spinner.style.position = "absolute";
  spinner.style.width = "100%";
  spinner.style.height = "100%";
  spinner.style.border = "5px solid #ddd";
  spinner.style.borderTop = "5px solid #393B65";
  spinner.style.borderRadius = "50%";
  spinner.style.animation = "spin 1.5s linear infinite";
  spinner.style.zIndex = "1";

  wrapper.appendChild(spinner);
  wrapper.appendChild(img);
  preloader.appendChild(wrapper);
  document.body.appendChild(preloader);

  document.body.style.overflow = "hidden";

  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  if (page) {
    page.style.filter = "blur(12px)";
  }

  setTimeout(() => {
    preloader.style.display = "none";
    document.body.style.overflow = "auto";
    if (page) {
      page.style.filter = "none";
    }
  }, 2000);
});


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
      const scrollTop = window.pageYOffset || window.scrollY || 0;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      if (scrollTop > 300) {
        goToTopBtn.classList.add('visible');
      } else {
        goToTopBtn.classList.remove('visible');
      }
      
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
    
    goToTopBtn.addEventListener('click', goToTop);
    
    function handleScroll() {
      const galleryModal = dom('#gallery-modal');
      if (galleryModal && !galleryModal.classList.contains('hidden')) {
        return;
      }
      updateScrollProgress();
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
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
      window.open('https://wa.me/201098408960?text=' + msg, '_blank');
      
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