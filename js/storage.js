// ========== إدارة المنتجات مع JSONBin ==========

// ========== جلب كل المنتجات ==========
async function getProducts() {
    try {
        const response = await fetch(`${JSONBIN_CONFIG.apiUrl}/${JSONBIN_CONFIG.binId}/latest`, {
            headers: {
                'X-Master-Key': JSONBIN_CONFIG.masterKey
            }
        });
        
        const data = await response.json();
        const record = data.record;
        
        // لو البيانات في شكل {products: []} نرجع المصفوفة
        if (record && record.products) {
            return record.products;
        }
        
        // لو البيانات مصفوفة مباشرة
        if (Array.isArray(record)) {
            return record;
        }
        
        return [];
    } catch (error) {
        console.error('Error getting products:', error);
        return [];
    }
}

// ========== حفظ المنتجات ==========
async function saveProducts(products) {
    try {
        const response = await fetch(`${JSONBIN_CONFIG.apiUrl}/${JSONBIN_CONFIG.binId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_CONFIG.masterKey
            },
            body: JSON.stringify({ products: products })
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error saving products:', error);
        return null;
    }
}

// ========== إضافة منتج جديد ==========
async function addProduct(productData) {
    const products = await getProducts();
    
    const newProduct = {
        id: Date.now().toString(),
        ...productData,
        date: new Date().toISOString()
    };
    
    products.push(newProduct);
    await saveProducts(products);
    
    return newProduct;
}

// ========== حذف منتج ==========
async function deleteProduct(id) {
    const products = await getProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    
    await saveProducts(filteredProducts);
    return true;
}

// ========== البحث في المنتجات ==========
async function searchProducts(query) {
    const products = await getProducts();
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) return products;
    
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
}

// ========== تصفية المنتجات ==========
async function filterProductsByCategory(category) {
    const products = await getProducts();
    
    if (category === 'all' || !category) {
        return products;
    }
    
    return products.filter(product => product.category === category);
}

// ========== جلب الفئات ==========
async function getCategories() {
    const products = await getProducts();
    const categories = [...new Set(products.map(p => p.category))];
    return categories;
}