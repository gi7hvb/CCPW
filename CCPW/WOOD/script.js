// --- Baza produktów dynamicznych dla wybranej podstrony ---
const products = [
    {
        id: 1,
        name: "CCPW Produkt Flagowy Pro",
        category: "Kategoria Główna",
        price: 89.99,
        desc: "Najwyższej jakości profesjonalny surowiec spełniający rygorystyczne normy przemysłowe i ekologiczne.",
        icon: "⚡",
        weight: "Opakowanie zbiorcze"
    },
    {
        id: 2,
        name: "CCPW Standard Eco Line",
        category: "Ekologia",
        price: 65.00,
        desc: "Sprawdzony wariant zrównoważony dedykowany do zastosowań komercyjnych oraz codziennego użytku.",
        icon: "🌿",
        weight: "Wersja standard"
    },
    {
        id: 3,
        name: "CCPW Industrial Heavy Duty",
        category: "Przemysł",
        price: 145.00,
        desc: "Wzmocniona linia produktów o podwyższonej wytrzymałości i wydajności operacyjnej.",
        icon: "🏗️",
        weight: "Wersja XXL"
    },
    {
        id: 4,
        name: "CCPW Special Edition",
        category: "Specjalistyczne",
        price: 49.99,
        desc: "Unikalna receptura i selekcjonowane źródła pozyskiwania materiału dla najbardziej wymagających.",
        icon: "💎",
        weight: "Wersja kompakt"
    }
];

let cart = [];
const SHIPPING_COST = 19.99;

// --- Selektory DOM ---
const productsGrid = document.getElementById('productsGrid');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const openCartBtn = document.getElementById('openCart');
const closeCartBtn = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartCountSpan = document.getElementById('cartCount');
const cartTotalSpan = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

const checkoutModal = document.getElementById('checkoutModal');
const checkoutOverlay = document.getElementById('checkoutOverlay');
const closeCheckoutBtn = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');
const summaryProductsPrice = document.getElementById('summaryProductsPrice');
const summaryTotalPrice = document.getElementById('summaryTotalPrice');

// --- Renderowanie produktów w siatce ---
function renderProducts() {
    if (!productsGrid) return;
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-img">${product.icon}</div>
            <div class="product-body">
                <span class="product-tag">${product.category} • ${product.weight}</span>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.desc}</p>
                <div class="product-footer">
                    <span class="product-price">${product.price.toFixed(2)} zł</span>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">Do koszyka</button>
                </div>
            </div>
        </div>
    `).join('');
}

// --- Logika Koszyka ---
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    openCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function changeQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountSpan) cartCountSpan.textContent = totalCount;

    if (cart.length === 0) {
        if (cartItemsContainer) cartItemsContainer.innerHTML = `<p class="empty-cart-msg">Koszyk jest pusty.</p>`;
        if (cartTotalSpan) cartTotalSpan.textContent = `0.00 zł`;
        return;
    }

    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item-row">
                <div class="cart-item-info">
                    <h5>${item.name}</h5>
                    <span>${item.price.toFixed(2)} zł x ${item.quantity}</span>
                </div>
                <div class="cart-item-controls">
                    <button onclick="changeQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        `).join('');
    }

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotalSpan) cartTotalSpan.textContent = `${totalPrice.toFixed(2)} zł`;
}

// --- Obsługa otwierania / zamykania paneli ---
function openCart() {
    if (cartDrawer) cartDrawer.classList.add('active');
    if (cartOverlay) cartOverlay.classList.add('active');
}

function closeCart() {
    if (cartDrawer) cartDrawer.classList.remove('active');
    if (cartOverlay) cartOverlay.classList.remove('active');
}

if (openCartBtn) openCartBtn.addEventListener('click', openCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

// --- Obsługa kasy (Checkout) ---
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Twój koszyk jest pusty!');
            return;
        }
        
        const productsSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (summaryProductsPrice) summaryProductsPrice.textContent = `${productsSubtotal.toFixed(2)} zł`;
        if (summaryTotalPrice) summaryTotalPrice.textContent = `${(productsSubtotal + SHIPPING_COST).toFixed(2)} zł`;

        closeCart();
        if (checkoutModal) checkoutModal.classList.add('active');
        if (checkoutOverlay) checkoutOverlay.classList.add('active');
    });
}

function closeCheckout() {
    if (checkoutModal) checkoutModal.classList.remove('active');
    if (checkoutOverlay) checkoutOverlay.classList.remove('active');
}

if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', closeCheckout);
if (checkoutOverlay) checkoutOverlay.addEventListener('click', closeCheckout);

// --- Zatwierdzenie zamówienia ---
if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const firstName = document.getElementById('firstName')?.value || 'Klient';
        
        alert(`Dziękujemy za zamówienie w CCPW, ${firstName}! Transakcja została pomyślnie zrealizowana.`);
        
        cart = [];
        updateCartUI();
        closeCheckout();
        checkoutForm.reset();
    });
}

// --- Start aplikacji ---
renderProducts();