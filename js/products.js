// ========== إدارة صفحة المنتجات ==========

document.addEventListener('DOMContentLoaded', async function() {
    await loadCategories();
    await loadAllProducts();
    setupSearch();
});

async function loadCategories() {
    const categories = await getCategories();
    const filtersContainer = document.getElementById('categoryFilters');
    
    if (!filtersContainer) return;
    
    filtersContainer.innerHTML = `
        <button class="filter-btn active" data-category="all">الكل</button>
        ${categories.map(category => `
            <button class="filter-btn" data-category="${category}">${category}</button>
        `).join('')}
    `;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            const filteredProducts = await filterProductsByCategory(category);
            displayProducts(filteredProducts);
        });
    });
}

function displayProducts(products) {
    const productsGrid = document.getElementById('allProducts');
    
    if (!productsGrid) return;
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div style="text-align: center; padding: 50px; grid-column: 1/-1;">
                <p style="font-size: 3em;">🌿</p>
                <p style="font-size: 1.5em;">مفيش منتجات متاحة حالياً</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image" 
                 onerror="this.src='images/placeholder.jpg'">
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">${product.price} جنيه</p>
                <button class="product-btn" onclick="orderProduct('${product.name}', ${product.price})">
                    اطلب الآن عبر واتساب
                </button>
            </div>
        </div>
    `).join('');
}

async function loadAllProducts() {
    const productsGrid = document.getElementById('allProducts');
    
    if (productsGrid) {
        productsGrid.innerHTML = '<div style="text-align: center; grid-column: 1/-1; padding: 50px;"><p>⏳ جاري التحميل...</p></div>';
    }
    
    const allProducts = await getProducts();
    displayProducts(allProducts);
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', async function() {
        const query = this.value;
        const results = await searchProducts(query);
        displayProducts(results);
    });
}

function orderProduct(productName, price) {
    const phoneNumber = '201557671143';
    const message = `مرحباً Firo Style 🌿\n\nأريد طلب:\nالمنتج: ${productName}\nالسعر: ${price} جنيه\n\nممكن تفاصيل أكثر؟`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}