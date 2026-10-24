// Baza produktów mineralnych (Węgiel kamienny, ekogroszek, orzech)
const products = [
    {
        id: 1,
        name: "Ekogroszek Workowany CCPW Power Gold",
        category: "Ekogroszek",
        price: 1650.00,
        desc: "Kaloryczność 26-28 MJ/kg. Niska zawartość popiołu (poniżej 4%), bardzo niska spiekalność. Pakowany w mocne worki po 25 kg.",
        icon: "⬛",
        weight: "1 tona (40 worków)"
    },
    {
        id: 2,
        name: "Węgiel Kamienny ORZECH II",
        category: "Orzech",
        price: 1420.00,
        desc: "Gruby węgiel opałowy idealny do tradycyjnych pieców zasypowych i kotłów co. Wysoki czas spalania, stabilna temperatura.",
        icon: "⛏️",
        weight: "1 tona (luz / paleta)"
    },
    {
        id: 3,
        name: "Węgiel Kostka Gruba Premium",
        category: "Kostka",
        price: 1550.00,
        desc: "Najwyższej jakości grube bryły węgla kamiennego o dużej wydajności cieplnej. Minimalna ilość zanieczyszczeń.",
        icon: "🧱",
        weight: "1 tona (luz)"
    },
    {
        id: 4,
        name: "Miał Węglowy Przemysłowy",
        category: "Miał",
        price: 1100.00,
        desc: "Ekonomiczne paliwo opałowe dedykowane dla instalacji przemysłowych oraz pieców z automatycznym podajnikiem miałowym.",
        icon: "💨",
        weight: "1 tona"
    }
];

let cart = [];
const SHIPPING_COST = 150.00;

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
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">Dodaj tonę do koszyka</button>
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
                <span>${item.price.toFixed(2)} zł x ${item.quantity} ton(y)</span>
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

// Zatwierdzenie formularza zamówienia opału
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    
    alert(`Dziękujemy za zamówienie węgla, ${firstName} ${lastName}! Skład CCPW Coal skontaktuje się z Tobą telefonicznie w celu potwierdzenia godziny dostawy samochodem ciężarowym.`);
    
    cart = [];
    updateCartUI();
    closeCheckout();
    checkoutForm.reset();
});

// Inicjalizacja startowa
renderProducts();