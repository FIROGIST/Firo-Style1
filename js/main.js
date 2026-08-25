// ========== تهيئة الصفحة الرئيسية ==========
document.addEventListener('DOMContentLoaded', async function() {
    await loadFeaturedProducts();
});

// ========== تحميل المنتجات المميزة ==========
async function loadFeaturedProducts() {
    const productsGrid = document.getElementById('featuredProducts');
    
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '<div style="text-align: center; grid-column: 1/-1; padding: 50px;"><p>⏳ جاري تحميل المنتجات...</p></div>';
    
    const products = await getProducts();
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div style="text-align: center; padding: 50px; grid-column: 1/-1;">
                <p style="font-size: 3em;">🌿</p>
                <p style="font-size: 1.2em;">منتجاتنا هتظهر هنا قريباً</p>
            </div>
        `;
        return;
    }
    
    const featuredProducts = products.filter(p => p.featured).slice(0, 6);
    const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 6);
    
    productsGrid.innerHTML = displayProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image" 
                 onerror="this.src='images/placeholder.jpg'">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${product.price} جنيه</p>
                <button class="product-btn" onclick="orderProduct('${product.name}', ${product.price})">
                    اطلب الآن
                </button>
            </div>
        </div>
    `).join('');
}
