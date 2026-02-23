// Cart functionality using localStorage
let cart = [];

// Load cart from localStorage
function loadCart() {
    const storedCart = localStorage.getItem('sanghaCart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    } else {
        cart = [];
    }
    updateCartCount();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('sanghaCart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count display
function updateCartCount() {
    const countElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countElements.forEach(el => {
        el.textContent = totalItems;
    });
}

// Add item to cart
function addToCart(item) {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    saveCart();
    alert(`${item.name} added to cart!`);
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    displayCartItems(); // if on booking page
}

// Clear cart
function clearCart() {
    cart = [];
    saveCart();
}

// Display cart items on booking page
function displayCartItems() {
    const cartList = document.getElementById('cart-items-list');
    const cartTotal = document.getElementById('cart-total');
    const emptyCartMsg = document.getElementById('empty-cart');
    if (!cartList) return;

    if (cart.length === 0) {
        cartList.innerHTML = '';
        emptyCartMsg.style.display = 'block';
        cartTotal.textContent = '$0';
        return;
    }

    emptyCartMsg.style.display = 'none';
    let total = 0;
    cartList.innerHTML = '';
    cart.forEach(item => {
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
            <span class="cart-item-name">${item.name} x${item.quantity}</span>
            <span class="cart-item-price">$${item.price * item.quantity}</span>
            <button class="cart-item-remove" data-id="${item.id}"><i class="fas fa-trash"></i></button>
        `;
        cartList.appendChild(li);
        total += item.price * item.quantity;
    });
    cartTotal.textContent = `$${total}`;

    // Add remove event listeners
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const id = this.dataset.id;
            removeFromCart(id);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadCart();

    // Add to cart buttons (packages and add-ons)
    document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const id = this.dataset.id;
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            addToCart({ id, name, price });
        });
    });

    // Handle contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('formSuccess').style.display = 'block';
            contactForm.reset();
            setTimeout(() => {
                document.getElementById('formSuccess').style.display = 'none';
            }, 5000);
        });
    }

    // Handle booking form submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        // Pre-fill fields from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const plan = urlParams.get('plan');
        const promo = urlParams.get('promo');

        if (plan) {
            const serviceSelect = document.getElementById('book-service');
            if (serviceSelect) {
                for (let option of serviceSelect.options) {
                    if (option.value === plan) {
                        option.selected = true;
                        break;
                    }
                }
            }
        }
        if (promo) {
            const promoField = document.getElementById('promo');
            if (promoField) {
                promoField.value = promo;
            }
        }

        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would normally send data to server
            // For now, just show success and clear cart
            document.getElementById('bookingSuccess').style.display = 'block';
            bookingForm.reset();
            clearCart();
            displayCartItems(); // update cart display
            setTimeout(() => {
                document.getElementById('bookingSuccess').style.display = 'none';
            }, 5000);
        });
    }

    // Display cart items on booking page
    displayCartItems();
});