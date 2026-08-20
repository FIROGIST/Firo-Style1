// ========== إدارة صفحة المنتجات ==========

document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    loadAllProducts();
    setupSearch();
});

// ========== تحميل الفئات ==========
function loadCategories() {
    const categories = getCategories();
    const filtersContainer = document.getElementById('categoryFilters');
    
    if (!filtersContainer) return;
    
    // إضافة زر "الكل" + باقي الفئات
    filtersContainer.innerHTML = `
        <button class="filter-btn active" data-category="all">الكل</button>
        ${categories.map(category => `
            <button class="filter-btn" data-category="${category}">${category}</button>
        `).join('')}
    `;
    
    // إضافة حدث الضغط على أزرار الفلاتر
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            const filteredProducts = filterProductsByCategory(category);
            displayProducts(filteredProducts);
        });
    });
}

// ========== عرض المنتجات ==========
function displayProducts(products) {
    const productsGrid = document.getElementById('allProducts');
    
    if (!productsGrid) return;
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div style="text-align: center; padding: 50px; grid-column: 1/-1;">
                <p style="font-size: 1.5em;">😔 مفيش منتجات متاحة حالياً</p>
                <p style="color: #666;">جرب تبحث عن حاجة تانية</p>
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

// ========== تحميل كل المنتجات ==========
function loadAllProducts() {
    const allProducts = getProducts();
    displayProducts(allProducts);
}

// ========== البحث ==========
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const query = this.value;
        const results = searchProducts(query);
        displayProducts(results);
    });
}

// ========== طلب منتج ==========
function orderProduct(productName, price) {
    const phoneNumber = '201557671143';
    const message = `مرحباً Firo Style 🌿\n\nأريد طلب:\nالمنتج: ${productName}\nالسعر: ${price} جنيه\n\nممكن تفاصيل أكثر؟`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}