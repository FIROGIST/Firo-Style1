// ========== إدارة التخزين المحلي ==========

// مفتاح التخزين في المتصفح
const STORAGE_KEY = 'firo_style_products';

// ========== جلب المنتجات من التخزين ==========
function getProducts() {
    const products = localStorage.getItem(STORAGE_KEY);
    
    // لو مفيش منتجات متخزنة، نرجع مصفوفة فاضية
    if (!products) {
        return [];
    }
    
    return JSON.parse(products);
}

// ========== حفظ المنتجات في التخزين ==========
function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// ========== إضافة منتج جديد ==========
function addProduct(productData) {
    const products = getProducts();
    
    // إنشاء ID جديد
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    const newProduct = {
        id: newId,
        ...productData,
        date: new Date().toISOString().split('T')[0] // تاريخ اليوم
    };
    
    products.push(newProduct);
    saveProducts(products);
    
    return newProduct;
}

// ========== تحديث منتج موجود ==========
function updateProduct(id, updatedData) {
    const products = getProducts();
    const index = products.findIndex(p => p.id === id);
    
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedData };
        saveProducts(products);
        return true;
    }
    
    return false;
}

// ========== حذف منتج ==========
function deleteProduct(id) {
    const products = getProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    
    if (filteredProducts.length !== products.length) {
        saveProducts(filteredProducts);
        return true;
    }
    
    return false;
}

// ========== جلب منتج محدد ==========
function getProductById(id) {
    const products = getProducts();
    return products.find(p => p.id === id);
}

// ========== البحث في المنتجات ==========
function searchProducts(query) {
    const products = getProducts();
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) return products;
    
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
}

// ========== تصفية المنتجات حسب الفئة ==========
function filterProductsByCategory(category) {
    const products = getProducts();
    
    if (category === 'all' || !category) {
        return products;
    }
    
    return products.filter(product => product.category === category);
}

// ========== جلب الفئات المتاحة ==========
function getCategories() {
    const products = getProducts();
    const categories = [...new Set(products.map(p => p.category))];
    return categories;
}

// ========== جلب المنتجات المميزة ==========
function getFeaturedProducts() {
    const products = getProducts();
    return products.filter(p => p.featured === true);
}

// ========== مسح كل المنتجات ==========
function clearAllProducts() {
    saveProducts([]);
}