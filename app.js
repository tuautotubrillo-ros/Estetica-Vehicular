/**
 * tuauto.tubrillo - JavaScript Interactivo & E-Commerce Logica
 * WhatsApp de contacto: 3417489454
 */

// 1. PRODUCTOS DE LA TIENDA DE CUIDADO PERSONAL DEL AUTO
const PRODUCTS = [
    {
        id: 1,
        name: "Microfibra Premium 400 GSM Sin Bordes (40x40cm)",
        category: "microfibra",
        price: 4500,
        image: "images/prod_microfiber.png",
        shortDesc: "Microfibra ultra suave de alta densidad, ideal para retirar ceras, pulidos y secado delicado sin rayar la laca.",
        description: "Esta microfibra de 400 GSM corta con láser sin bordes ni costuras evita la creación de micro-rayones (swirls). Absorbe hasta 7 veces su peso en agua y es perfecta para el secado de pintura y cristales."
    },
    {
        id: 2,
        name: "Perfume de Auto Deluxe - Fragancia Luxury Car",
        category: "perfumes",
        price: 6800,
        image: "images/prod_perfume.png",
        shortDesc: "Aroma a auto nuevo exclusivo en frasco de vidrio de 60ml con atomizador fino de larga duración.",
        description: "Aromatizante concentrado de alta gama formulado para interiores. Brinda un aroma fresco, sobrio y elegante de larga persistencia sin dejar residuos oleosos en tapizados ni tableros."
    },
    {
        id: 3,
        name: "Renovador de Plásticos & Cubiertas Gloss Finish",
        category: "renovadores",
        price: 8900,
        image: "images/prod_renovator.png",
        shortDesc: "Restaura el color negro mate original y otorga brillo hidrofóbico protector UV.",
        description: "Acondicionador premium para plásticos exteriores, paragolpes y neumáticos. Repele el agua y el polvo, protegiendo las superficies contra el desgaste del sol y el envejecimiento."
    },
    {
        id: 4,
        name: "Set de 5 Pinceles Detailing Ultra Suaves",
        category: "pinceles",
        price: 9500,
        image: "images/prod_brushes.png",
        shortDesc: "Set de pinceles sintéticos anti-rayaduras para rejillas de ventilación, insignias y botones.",
        description: "Kit de 5 tamaños diferentes de pinceles diseñados para alcanzar cada rincón difícil del interior y exterior. Cerdas resistentes a productos químicos y sin componentes metálicos para proteger la superficie."
    },
    {
        id: 5,
        name: "Cera Rápida Quick Detailer SiO2 (500ml)",
        category: "renovadores",
        price: 11200,
        image: "images/prod_renovator.png",
        shortDesc: "Cera líquida rápida con polímeros de cuarzo SiO2 para brillo espejo instantáneo y repelencia al agua.",
        description: "Ideal para aplicar después del lavado. Potencia el brillo, suavidad y protección de cualquier tratamiento previo cerámico o acrílico."
    },
    {
        id: 6,
        name: "Champú Neutro Snow Foam pH 7 (1 Litro)",
        category: "renovadores",
        price: 7800,
        image: "images/hero.png",
        shortDesc: "Detergente de alta espuma que remueve la suciedad pesada sin barrer ceras ni selladores.",
        description: "Formulado con tensoactivos de alta calidad que crean una densa capa de espuma Snow Foam. Lubrica la superficie durante el lavado técnico."
    },
    {
        id: 7,
        name: "Guante de Lavado de Microfibra de Felpa",
        category: "microfibra",
        price: 6200,
        image: "images/prod_microfiber.png",
        shortDesc: "Guante ergonómico para lavado seguro de carrocería con entramado de microfibra atrapa-polvo.",
        description: "Retiene la suciedad atrapándola profundamente en sus fibras para evitar el contacto directo con la pintura del coche."
    },
    {
        id: 8,
        name: "Acondicionador de Cuero & Cuero Ecológico (300ml)",
        category: "renovadores",
        price: 10500,
        image: "images/prod_perfume.png",
        shortDesc: "Nutre, hidrata y protege los asientos de cuero previniendo grietas y decoloración.",
        description: "Fórmula no grasosa de acabado natural mate que restaura la flexibilidad y textura suave del cuero."
    }
];

// ESTADO GLOBAL DEL CARRITO
let cart = JSON.parse(localStorage.getItem('tuauto_cart')) || [];

// DOCUMENT READY
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderProducts(PRODUCTS);
    updateCartUI();
    initShopEvents();
    initCartDrawerEvents();
    initCalculator();
    initBeforeAfterSlider();
    initFaqAccordion();
    initMobileNav();
}

/* ==========================================================================
   1. RENDERIZADO Y FILTRADO DE PRODUCTOS
   ========================================================================== */
function renderProducts(productsToRender) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    if (productsToRender.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
                <i class="fa-solid fa-box-open" style="font-size: 3rem; margin-bottom: 15px; color: var(--primary);"></i>
                <p style="font-size: 1.1rem;">No se encontraron productos que coincidan con la búsqueda.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-img-wrapper" onclick="openProductModal(${product.id})">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <span class="product-category-tag">${product.category}</span>
            </div>
            <div class="product-info">
                <h3 class="product-title" onclick="openProductModal(${product.id})" style="cursor: pointer;">${product.name}</h3>
                <p class="product-desc-short">${product.shortDesc}</p>
                <div class="product-bottom">
                    <span class="product-price">$${product.price.toLocaleString('es-AR')} ARS</span>
                    <button class="add-cart-btn" onclick="addToCart(${product.id})" aria-label="Agregar al carrito">
                        <i class="fa-solid fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function initShopEvents() {
    // Filtros por Categoría (Pills)
    const pills = document.querySelectorAll('.pill-btn');
    pills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filter = pill.dataset.filter;
            filterProducts();
        });
    });

    // Búsqueda por texto
    const searchInput = document.getElementById('shopSearch');
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
}

function filterProducts() {
    const activePill = document.querySelector('.pill-btn.active');
    const filterCategory = activePill ? activePill.dataset.filter : 'all';
    const searchQuery = document.getElementById('shopSearch').value.toLowerCase().trim();

    const filtered = PRODUCTS.filter(product => {
        const matchesCategory = (filterCategory === 'all') || (product.category === filterCategory);
        const matchesSearch = product.name.toLowerCase().includes(searchQuery) ||
                              product.shortDesc.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    renderProducts(filtered);
}

/* ==========================================================================
   2. CARRITO DE COMPRAS & CHECKOUT VIA WHATSAPP
   ========================================================================== */
function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    openCartDrawer();
}

function updateCartQuantity(productId, change) {
    const index = cart.findIndex(item => item.id === productId);
    if (index === -1) return;

    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('tuauto_cart', JSON.stringify(cart));
}

function updateCartUI() {
    // Actualizar badge del header
    const cartCountEl = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountEl) {
        cartCountEl.textContent = totalItems;
    }

    // Actualizar lista en drawer
    const container = document.getElementById('cartItemsContainer');
    const cartTotalEl = document.getElementById('cartTotal');
    
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
                <i class="fa-solid fa-cart-arrow-down" style="font-size: 2.5rem; color: var(--primary); margin-bottom: 10px;"></i>
                <p>Tu carrito está vacío</p>
            </div>
        `;
        if (cartTotalEl) cartTotalEl.textContent = '$0 ARS';
        return;
    }

    let totalPrice = 0;
    container.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toLocaleString('es-AR')} ARS</div>
                    <div class="cart-qty-controls">
                        <button class="qty-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    if (cartTotalEl) {
        cartTotalEl.textContent = `$${totalPrice.toLocaleString('es-AR')} ARS`;
    }
}

function initCartDrawerEvents() {
    const cartBtn = document.getElementById('cartBtn');
    const closeBtn = document.getElementById('cartCloseBtn');
    const overlay = document.getElementById('cartOverlay');
    const checkoutBtn = document.getElementById('checkoutWaBtn');

    if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
    if (overlay) overlay.addEventListener('click', closeCartDrawer);

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', sendCartToWhatsApp);
    }
}

function openCartDrawer() {
    document.getElementById('cartDrawer').classList.add('active');
    document.getElementById('cartOverlay').classList.add('active');
}

function closeCartDrawer() {
    document.getElementById('cartDrawer').classList.remove('active');
    document.getElementById('cartOverlay').classList.remove('active');
}

function sendCartToWhatsApp() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de realizar la compra.');
        return;
    }

    let message = `🛒 *NUEVO PEDIDO DE PRODUCTOS - tuauto.tubrillo*\n\n`;
    let total = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        message += `${index + 1}. *${item.name}*\n   Cantidad: ${item.quantity} x $${item.price.toLocaleString('es-AR')} = $${subtotal.toLocaleString('es-AR')}\n\n`;
    });

    message += `💰 *TOTAL ESTIMADO:* $${total.toLocaleString('es-AR')} ARS\n\n`;
    message += `📍 *Servicio a Domicilio / Entrega*\nQuedo a la espera para coordinar el pago y envío. ¡Muchas gracias!`;

    const encodedMsg = encodeURIComponent(message);
    const waUrl = `https://wa.me/5493417489454?text=${encodedMsg}`;

    window.open(waUrl, '_blank');
}

/* ==========================================================================
   3. MODAL VISTA DETALLADA DE PRODUCTO
   ========================================================================== */
function openProductModal(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('modalImg').src = product.image;
    document.getElementById('modalCategory').textContent = product.category.toUpperCase();
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalPrice').textContent = `$${product.price.toLocaleString('es-AR')} ARS`;
    document.getElementById('modalDescription').textContent = product.description;

    const addBtn = document.getElementById('modalAddToCartBtn');
    addBtn.onclick = () => {
        addToCart(product.id);
        closeProductModal();
    };

    document.getElementById('productModalOverlay').classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModalOverlay').classList.remove('active');
}

document.getElementById('modalCloseBtn')?.addEventListener('click', closeProductModal);
document.getElementById('productModalOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'productModalOverlay') closeProductModal();
});

/* ==========================================================================
   4. COTIZADOR DE SERVICIOS INTERACTIVO
   ========================================================================== */
function initCalculator() {
    const vehicleCards = document.querySelectorAll('.vehicle-card');
    const serviceChecks = document.querySelectorAll('.service-calc-check');
    const sendBtn = document.getElementById('sendCalcWa');

    vehicleCards.forEach(card => {
        card.addEventListener('click', () => {
            vehicleCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const radio = card.querySelector('input');
            if (radio) radio.checked = true;
            calculateServicesTotal();
        });
    });

    serviceChecks.forEach(check => {
        check.addEventListener('change', calculateServicesTotal);
    });

    if (sendBtn) {
        sendBtn.addEventListener('click', sendCalcToWhatsApp);
    }

    calculateServicesTotal();
}

function calculateServicesTotal() {
    const selectedServices = document.querySelectorAll('.service-calc-check:checked');
    let total = 0;

    selectedServices.forEach(check => {
        total += parseInt(check.dataset.price || 0);
    });

    const totalEl = document.getElementById('calcTotalAmount');
    if (totalEl) {
        totalEl.textContent = `$${total.toLocaleString('es-AR')} ARS`;
    }
}

function sendCalcToWhatsApp() {
    const activeVehicleRadio = document.querySelector('input[name="vehicleType"]:checked');
    const vehicleType = activeVehicleRadio ? activeVehicleRadio.value : 'No especificado';
    const selectedServices = document.querySelectorAll('.service-calc-check:checked');

    if (selectedServices.length === 0) {
        alert('Por favor selecciona al menos un servicio para solicitar tu presupuesto.');
        return;
    }

    let message = `📋 *SOLICITUD DE PRESUPUESTO A DOMICILIO - tuauto.tubrillo*\n\n`;
    message += `🚗 *Tipo de Vehículo:* ${vehicleType}\n\n`;
    message += `✨ *Servicios Seleccionados:*\n`;

    let totalEst = 0;
    selectedServices.forEach(srv => {
        const price = parseInt(srv.dataset.price || 0);
        totalEst += price;
        message += ` • ${srv.value}\n`;
    });

    message += `\n💰 *Estimado Aproximado:* $${totalEst.toLocaleString('es-AR')} ARS\n\n`;
    message += `📍 *Ubicación / Domicilio:* (Por favor indicar barrio o zona)\n`;
    message += `Quiero consultar fechas y horarios disponibles a domicilio.`;

    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/5493417489454?text=${encodedMsg}`, '_blank');
}

/* ==========================================================================
   5. SLIDER ANTES Y DESPUÉS
   ========================================================================== */
function initBeforeAfterSlider() {
    const slider = document.getElementById('comparisonSlider');
    const afterImg = slider?.querySelector('.img-after');
    const handle = document.getElementById('sliderHandle');

    if (!slider || !afterImg || !handle) return;

    let isDragging = false;

    const moveSlider = (x) => {
        const rect = slider.getBoundingClientRect();
        let posX = x - rect.left;
        if (posX < 0) posX = 0;
        if (posX > rect.width) posX = rect.width;

        const percentage = (posX / rect.width) * 100;
        afterImg.style.width = `${percentage}%`;
        handle.style.left = `${percentage}%`;
    };

    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        moveSlider(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        moveSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Soporte para dispositivos táctiles
    slider.addEventListener('touchstart', (e) => {
        isDragging = true;
        moveSlider(e.touches[0].clientX);
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        moveSlider(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });
}

/* ==========================================================================
   6. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        questionBtn.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isOpen) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

/* ==========================================================================
   7. MENÚ RESPONSIVO MÓVIL
   ========================================================================== */
function initMobileNav() {
    const toggleBtn = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    const links = navMenu.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}
