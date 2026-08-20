// ========== تهيئة الموقع ==========
document.addEventListener('DOMContentLoaded', function() {
    // تحميل المنتجات
    loadFeaturedProducts();
});

// ========== تحميل المنتجات المميزة ==========
function loadFeaturedProducts() {
    const products = getProducts(); // من ملف storage.js
    const productsGrid = document.getElementById('featuredProducts');
    
    if (!productsGrid) return;
    
    // لو مفيش منتجات، اعرض رسالة
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products" style="text-align: center; padding: 50px; grid-column: 1/-1;">
                <p style="font-size: 1.2em;">🌿 منتجاتنا هتظهر هنا قريباً</p>
            </div>
        `;
        return;
    }
    
    // عرض أول 6 منتجات فقط في الصفحة الرئيسية
    const featuredProducts = products.slice(0, 6);
    
    productsGrid.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${product.price} جنيه</p>
                <button class="product-btn" onclick="orderProduct('${product.name}')">
                    اطلب الآن
                </button>
            </div>
        </div>
    `).join('');
}

// ========== طلب منتج عبر الواتساب ==========
function orderProduct(productName) {
    const phoneNumber = '201557671143';
    const message = `مرحباً Firo Style 🌿\nأريد طلب: ${productName}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}