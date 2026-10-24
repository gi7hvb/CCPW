// Baza produktów Charcoal (Węgiel drzewny i brykiety)
const products = [
    {
        id: 1,
        name: "CCPW Resto Chef Charcoal",
        category: "Gastronomia",
        price: 89.99,
        desc: "Profesjonalny węgiel z twardego drewna liściastego (dąb/buk). Duże kawałki, błyskawiczny rozruch i bardzo długi żar.",
        icon: "🔥",
        weight: "10 kg"
    },
    {
        id: 2,
        name: "CCPW Eco Briquette Premium",
        category: "Brykiet",
        price: 65.00,
        desc: "Wysokiej jakości brykiet z węgla drzewnego. Zapewnia stabilną temperaturę do 6 godzin. Idealny do grilli zamkniętych.",
        icon: "⬛",
        weight: "10 kg"
    },
    {
        id: 3,
        name: "CCPW Grill Master Classic",
        category: "Dom i Ogród",
        price: 45.99,
        desc: "Klasyczny węgiel drzewny do domowego grillowania. Łatwy w rozpalaniu, charakteryzuje się minimalną ilością popiołu.",
        icon: "🪵",
        weight: "5 kg"
    },
    {
        id: 4,
        name: "CCPW Shisha Gold Charcoal",
        category: "Shisha / Special",
        price: 34.50,
        desc: "Czysty węgiel z łupin orzecha kokosowego do shishy. Bezwonny, bezdymny i niesamowicie długo trzymający temperaturę.",
        icon: "🥥",
        weight: "1 kg"
    }
];

let cart = [];
const SHIPPING_COST = 19.99;

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

// Zarządzanie oknem finalizacji zamówienia (Checkout)
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Twój koszyk jest pusty!');
        return;
    }
    
    // Oblicz sumy w podsumowaniu kasy
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

// Zatwierdzenie formularza zamówienia
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    
    alert(`Dziękujemy za zamówienie, ${firstName} ${lastName}! Twoje zamówienie na węgiel CCPW Charcoal zostało przyjęte do realizacji. Potwierdzenie wysłaliśmy na e-mail.`);
    
    // Reset koszyka i zamknięcie modali
    cart = [];
    updateCartUI();
    closeCheckout();
    checkoutForm.reset();
});

// Inicjalizacja startowa
renderProducts();