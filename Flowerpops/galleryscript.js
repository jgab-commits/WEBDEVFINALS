document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort-price');
    const flowerGrid = document.querySelector('.flower-grid');
    const flowerCards = Array.from(document.querySelectorAll('.flower-card'));
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    const cartKey = 'flowerpopsCart';
    let cart = [];

    function loadCart() {
        const storedCart = localStorage.getItem(cartKey);
        cart = storedCart ? JSON.parse(storedCart) : [];
        renderCart();
    }

    function saveCart() {
        localStorage.setItem(cartKey, JSON.stringify(cart));
    }

    function getCartTotal() {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        if (!cart.length) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty. Add flowers to get started.</p>';
            checkoutBtn.style.display = 'none';
            cartTotalEl.textContent = '0.00';
            return;
        }

        checkoutBtn.style.display = 'inline-flex';

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="item-copy">
                    <span>${item.title}</span>
                    <small>₱${item.price.toFixed(2)} each</small>
                </div>
                <div class="item-controls">
                    <button class="quantity-btn" type="button" data-action="decrease" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" type="button" data-action="increase" data-index="${index}">+</button>
                    <button class="remove-item" type="button" data-index="${index}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        cartTotalEl.textContent = getCartTotal().toFixed(2);
    }

    function addToCart(card) {
        const title = card.querySelector('h3').textContent.trim();
        const price = parseFloat(card.dataset.price);
        const existingItem = cart.find(item => item.title === title);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                title,
                price,
                quantity: 1
            });
        }

        saveCart();
        renderCart();
    }

    function updateQuantity(index, delta) {
        if (!cart[index]) return;
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart();
        renderCart();
    }

    function removeFromCart(index) {
        if (!cart[index]) return;
        cart.splice(index, 1);
        saveCart();
        renderCart();
    }

    cartItemsContainer.addEventListener('click', function(event) {
        const target = event.target;
        const index = parseInt(target.dataset.index, 10);
        if (target.matches('.remove-item')) {
            removeFromCart(index);
        }
        if (target.matches('.quantity-btn')) {
            const action = target.dataset.action;
            updateQuantity(index, action === 'increase' ? 1 : -1);
        }
    });

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.flower-card');
            if (card) {
                addToCart(card);
            }
        });
    });

    function filterFlowers(category) {
        flowerCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function sortFlowers(order) {
        const visibleCards = flowerCards.filter(card => card.style.display !== 'none');
        visibleCards.sort((a, b) => {
            const priceA = parseFloat(a.dataset.price);
            const priceB = parseFloat(b.dataset.price);
            if (order === 'low-to-high') {
                return priceA - priceB;
            } else if (order === 'high-to-low') {
                return priceB - priceA;
            }
            return 0;
        });
        visibleCards.forEach(card => flowerGrid.appendChild(card));
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const category = this.dataset.category;
            filterFlowers(category);
            const currentSort = sortSelect.value;
            if (currentSort !== 'default') {
                sortFlowers(currentSort);
            }
        });
    });

    sortSelect.addEventListener('change', function() {
        sortFlowers(this.value);
    });

    loadCart();
});