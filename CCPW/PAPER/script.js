// Baza produktów papierniczych i celulozowych
const products = [
    {
        id: 1,
        name: "CCPW Eco Copier Paper A4",
        category: "Papier Biurowy",
        price: 24.99,
        desc: "Ekologiczny papier ksero A4 (80g/m²), 100% z recyklingu, certyfikat FSC. Karton zawiera 5 ryz (2500 arkuszy).",
        icon: "📄",
        weight: "Karton 5 ryz"
    },
    {
        id: 2,
        name: "CCPW Industrial Kraft Cardboard Boxes",
        category: "Opakowania",
        price: 120.00,
        desc: "Wytrzymałe 3-warstwowe kartony wysyłkowe z brązowej tektury kraft. Zestaw 50 sztuk w formacie standardowym.",
        icon: "📦",
        weight: "Pakiet 50 szt."
    },
    {
        id: 3,
        name: "CCPW Cellulose Industrial Roll",
        category: "Celuloza Przemysłowa",
        price: 59.99,
        desc: "Dwuwarstwowe czyściwo celulozowe o wysokiej chłonności. Idealne do zastosowań warsztatowych, gastronomicznych i biurowych.",
        icon: "🧻",
        weight: "Rolka XXL"
    },
    {
        id: 4,
        name: "CCPW Biodegradable Food Paper",
        category: "Gastronomiczny",
        price: 45.00,
        desc: "Półpergamin powlekany powłoką roślinną do pakowania żywności, burgerów i kanapek. Odporny na tłuszcz i wilgoć.",
        icon: "📜",
        weight: "Rolka 100m"
    }
];

let cart = [];
const SHIPPING_COST = 24.99;

// Elementy DOM
const productsGrid = document.getElementById('productsGrid');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const openCartBtn = document.getElementById('openCart');
const closeCartBtn = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartCountSpan = document.getElementById('cartCount');
const cartTotalSpan = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

// Elementy modalu kasy
const checkoutModal = document.getElementById('checkoutModal');
const checkoutOverlay = document.getElementById('checkoutOverlay');
const closeCheckoutBtn = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');
const summaryProductsPrice = document.getElementById('summaryProductsPrice');
const summaryTotalPrice = document.getElementById('summaryTotalPrice');

// Renderowanie produktów na stronie
function renderProducts() {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-img">${product.icon}</div>
            <div class="product-body">
                <span class="product-tag">${product.category} • ${product.weight}</span>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.desc}</p>
                <div class="product-footer">
                    <span class="product-price">${product.price.toFixed(2)} zł</span>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">Dodaj do koszyka</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Obsługa koszyka
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
    cartCountSpan.textContent = totalCount;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart-msg">Koszyk jest pusty.</p>`;
        cartTotalSpan.textContent = `0.00 zł`;
        return;
    }

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

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalSpan.textContent = `${totalPrice.toFixed(2)} zł`;
}

// Zarządzanie panelem koszyka
function openCart() {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
}

function closeCart() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
}

openCartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Zarządzanie oknem finalizacji zamówienia
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Twój koszyk jest pusty!');
        return;
    }
    
    const productsSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    summaryProductsPrice.textContent = `${productsSubtotal.toFixed(2)} zł`;
    summaryTotalPrice.textContent = `${(productsSubtotal + SHIPPING_COST).toFixed(2)} zł`;

    closeCart();
    checkoutModal.classList.add('active');
    checkoutOverlay.classList.add('active');
});

function closeCheckout() {
    checkoutModal.classList.remove('active');
    checkoutOverlay.classList.remove('active');
}

closeCheckoutBtn.addEventListener('click', closeCheckout);
checkoutOverlay.addEventListener('click', closeCheckout);

// Zatwierdzenie formularza zamówienia papieru
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    
    alert(`Dziękujemy za zamówienie ekologicznych wyrobów papierniczych CCPW, ${firstName}! Twoja przesyłka zostanie skompletowana i wysłana z certyfikatem FSC.`);
    
    cart = [];
    updateCartUI();
    closeCheckout();
    checkoutForm.reset();
});

// Inicjalizacja startowa
renderProducts();