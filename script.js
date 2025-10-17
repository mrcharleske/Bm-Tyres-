// script.js - handles menu, products loading, modals, CTA popups, install prompt, PWA register & AOS

document.addEventListener('DOMContentLoaded', () => {
  // AOS init
  if (window.AOS) AOS.init({ duration: 700, once: true });

  // set year where present
  const y = new Date().getFullYear();
  const yearEls = document.querySelectorAll('#year, #yearAbout, #yearContact');
  yearEls.forEach(e => e && (e.textContent = y));

  // mobile menu toggles
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn) menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

  const menuBtnShop = document.getElementById('menuBtnShop');
  const mobileMenuShop = document.getElementById('mobileMenuShop');
  if (menuBtnShop) menuBtnShop.addEventListener('click', () => mobileMenuShop.classList.toggle('hidden'));

  // CTA modal logic (for index.html)
  document.querySelectorAll('.cta-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const key = btn.getAttribute('data-cta');
      openCTAModal(key);
    });
  });

  const modalBackdrop = document.getElementById('modalBackdrop');
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) closeModal(); });

  function openCTAModal(key) {
    const content = {
      delivery: `<h3 class="text-xl font-bold">Nationwide Delivery</h3>
        <p class="mt-2 text-gray-700">We deliver to all major towns across Kenya. Delivery fees depend on location and product weight. To get an accurate delivery quote: 1) Click "Order via WhatsApp" on a product 2) Share your location and delivery address 3) We confirm availability and shipping cost.</p>
        <p class="mt-2"><strong>Note:</strong> For remote areas additional charges may apply.</p>
        <div class="mt-4"><a href="https://wa.me/254714512412?text=Hi%20I%20need%20delivery%20quote" target="_blank" class="px-4 py-2 bg-primary text-white rounded">Ask for delivery quote on WhatsApp</a></div>`,

      brands: `<h3 class="text-xl font-bold">Quality Brands</h3>
        <p class="mt-2 text-gray-700">We stock trusted brands including Michelin, Bridgestone, Goodyear, Pirelli, Continental, Enkei, BBS and more. Brands vary by stock; send us a WhatsApp message with the model you're looking for and we'll confirm availability and price.</p>
        <div class="mt-4"><a href="https://wa.me/254714512412?text=Hi%20do%20you%20have%20Michelin%20Primacy%204" target="_blank" class="px-4 py-2 bg-primary text-white rounded">Ask about brands on WhatsApp</a></div>`,

      support: `<h3 class="text-xl font-bold">Order Support</h3>
        <p class="mt-2 text-gray-700">Ordering steps: 1) Browse products 2) Click "Order via WhatsApp" on the item 3) Send your location and preferred payment method 4) We confirm and dispatch. Support is available on WhatsApp and by phone.</p>
        <div class="mt-4"><a href="https://wa.me/254714512412?text=Hi%20I%20need%20order%20support" target="_blank" class="px-4 py-2 bg-primary text-white rounded">Message support on WhatsApp</a></div>`
    }[key] || '<p>Details coming soon.</p>';

    if (modalBackdrop && modalContent) {
      modalContent.innerHTML = content;
      modalBackdrop.classList.add('active');
      modalBackdrop.classList.remove('hidden');
    }
  }

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      modalBackdrop.classList.add('hidden');
    }
    if (modalContent) modalContent.innerHTML = '';
  }

  // Product loading: used by index.html and shop.html
  fetch('./products.json').then(r => r.json()).then(products => {
    // index featured (first 3)
    const featuredGrid = document.getElementById('featuredGrid');
    if (featuredGrid) {
      const featured = products.slice(0, 3);
      featuredGrid.innerHTML = '';
      featured.forEach(p => {
        const el = document.createElement('article');
        el.className = 'bg-white rounded-lg card-shadow overflow-hidden flex flex-col';
        el.innerHTML = `
          <img src="${p.image}" alt="${p.model}" class="product-img" />
          <div class="p-4 flex-1 flex flex-col">
            <h3 class="font-bold">${p.brand} ${p.model}</h3>
            <p class="text-sm text-gray-600">${p.size} — ${p.type}</p>
            <div class="mt-2 font-semibold text-primary">KSH ${p.price_ksh.toLocaleString('en-KE')}</div>
            <p class="mt-2 text-sm text-gray-600 flex-1">${p.description}</p>
            <div class="mt-4 flex gap-2">
              <a href="https://wa.me/254714512412?text=${encodeURIComponent("Hi BM Tyres, I'm interested in: "+p.brand+" "+p.model+" ("+p.size+") - KSH "+p.price_ksh)}" target="_blank" class="flex-1 text-center py-2 rounded bg-primary text-white font-semibold">Order via WhatsApp</a>
              <a href="tel:+254714512412" class="py-2 px-4 rounded border border-gray-200">Call</a>
            </div>
          </div>
        `;
        el.setAttribute('data-aos','fade-up');
        featuredGrid.appendChild(el);
      });
      if (window.AOS) AOS.refresh();
    }

    // shop page grid
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
      function render(list) {
        productsGrid.innerHTML = '';
        list.forEach(p => {
          const card = document.createElement('article');
          card.className = 'bg-white rounded-lg card-shadow overflow-hidden flex flex-col';
          card.innerHTML = `
            <img src="${p.image}" alt="${p.model}" class="product-img" />
            <div class="p-4 flex-1 flex flex-col">
              <h3 class="font-bold">${p.brand} ${p.model}</h3>
              <p class="text-sm text-gray-600">${p.size} — ${p.type}</p>
              <div class="mt-2 font-semibold text-primary">KSH ${p.price_ksh.toLocaleString('en-KE')}</div>
              <p class="mt-2 text-sm text-gray-600 flex-1">${p.description}</p>
              <div class="mt-4 flex gap-2">
                <button class="flex-1 text-center py-2 rounded bg-primary text-white font-semibold viewProductBtn" data-id="${p.id}">View</button>
                <a href="https://wa.me/254714512412?text=${encodeURIComponent("Hi BM Tyres, I'm interested in: "+p.brand+" "+p.model+" ("+p.size+") - KSH "+p.price_ksh)}" target="_blank" class="py-2 px-4 rounded border border-gray-200">Order via WhatsApp</a>
              </div>
            </div>
          `;
          card.setAttribute('data-aos','fade-up');
          productsGrid.appendChild(card);
        });
        attachViewButtons(list);
        if (window.AOS) AOS.refresh();
      }

      render(products);

      // filters & search
      const typeFilter = document.getElementById('typeFilter');
      const searchInput = document.getElementById('searchInput');
      if (typeFilter) typeFilter.addEventListener('change', () => {
        const t = typeFilter.value;
        const filtered = t === 'All' ? products : products.filter(p => p.type === t);
        render(filtered);
      });
      if (searchInput) searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        const filtered = products.filter(p => (p.brand + ' ' + p.model).toLowerCase().includes(q));
        render(filtered);
      });

      // product modal logic
      const pBackdrop = document.getElementById('productModalBackdrop');
      const pModal = document.getElementById('productModal');
      const pModalContent = document.getElementById('productModalContent');
      const pClose = document.getElementById('productModalClose');
      if (pClose) pClose.addEventListener('click', closeProductModal);
      if (pBackdrop) pBackdrop.addEventListener('click', (e) => { if (e.target === pBackdrop) closeProductModal(); });

      function attachViewButtons(list) {
        document.querySelectorAll('.viewProductBtn').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const prod = list.find(x => x.id === id) || products.find(x => x.id === id);
            if (prod) openProductModal(prod);
          });
        });
      }

      function openProductModal(prod) {
        if (!pBackdrop || !pModalContent) return;
        pModalContent.innerHTML = `
          <div class="grid md:grid-cols-2 gap-4">
            <div><img src="${prod.image}" alt="${prod.model}" class="w-full rounded"/></div>
            <div>
              <h3 class="text-xl font-bold">${prod.brand} ${prod.model}</h3>
              <p class="text-sm text-gray-600 mt-1">${prod.size} — ${prod.type}</p>
              <div class="mt-3 font-semibold text-primary">KSH ${prod.price_ksh.toLocaleString('en-KE')}</div>
              <p class="mt-3 text-gray-700">${prod.description}</p>
              <div class="mt-4 flex gap-2">
                <a href="https://wa.me/254714512412?text=${encodeURIComponent("Hi BM Tyres, I'm interested in: "+prod.brand+" "+prod.model+" ("+prod.size+") - KSH "+prod.price_ksh)}" target="_blank" class="px-4 py-2 bg-primary text-white rounded">Order via WhatsApp</a>
                <a href="tel:+254714512412" class="px-4 py-2 border rounded">Call</a>
              </div>
            </div>
          </div>
        `;
        pBackdrop.classList.add('active'); pBackdrop.classList.remove('hidden');
      }

      function closeProductModal() {
        if (pBackdrop) { pBackdrop.classList.remove('active'); pBackdrop.classList.add('hidden'); }
        if (pModalContent) pModalContent.innerHTML = '';
      }
    }
  }).catch(err => {
    console.warn('Products load failed', err);
  });

  // PWA install prompt handling
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // show floating install button
    const ib = document.getElementById('installBtnFloat');
    const ibShop = document.getElementById('installBtnFloatShop');
    if (ib) ib.style.display = 'flex';
    if (ibShop) ibShop.style.display = 'flex';
  });

  // Install button action
  const installBtn = document.getElementById('installBtnFloat');
  const installBtnShop = document.getElementById('installBtnFloatShop');
  [installBtn, installBtnShop].forEach(btn => {
    if (btn) btn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      deferredPrompt = null;
    });
  });

  // register service worker - separate guard
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').then(reg => {
        console.log('SW registered', reg);
      }).catch(err => console.warn('SW failed', err));
    });
  }
});
