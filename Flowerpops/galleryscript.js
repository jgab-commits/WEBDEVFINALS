document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort-price');
    const flowerGrid = document.querySelector('.flower-grid');
    const flowerCards = Array.from(document.querySelectorAll('.flower-card'));

    // Function to filter flowers
    function filterFlowers(category) {
        flowerCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Function to sort flowers
    function sortFlowers(order) {
        const visibleCards = flowerCards.filter(card => card.style.display !== 'none');
        visibleCards.sort((a, b) => {
            const priceA = parseFloat(a.dataset.price);
            const priceB = parseFloat(b.dataset.price);
            if (order === 'low-to-high') {
                return priceA - priceB;
            } else if (order === 'high-to-low') {
                return priceB - priceA;
            } else {
                // Default order, perhaps by original order, but for now, no sort
                return 0;
            }
        });
        // Re-append sorted cards
        visibleCards.forEach(card => flowerGrid.appendChild(card));
    }

    // Event listeners for filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');
            const category = this.dataset.category;
            filterFlowers(category);
            // After filtering, sort if needed
            const currentSort = sortSelect.value;
            if (currentSort !== 'default') {
                sortFlowers(currentSort);
            }
        });
    });

    // Event listener for sort select
    sortSelect.addEventListener('change', function() {
        const order = this.value;
        sortFlowers(order);
    });
});