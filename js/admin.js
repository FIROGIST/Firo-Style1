// ========== إدارة لوحة التحكم ==========

// كلمة المرور السرية - تقدر تغيرها زي ما تحب
const ADMIN_PASSWORD = "Firo@2024";

// تحقق من حالة تسجيل الدخول
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});

// ========== التحقق من كلمة المرور ==========
function checkPassword() {
    const password = document.getElementById('passwordInput').value;
    
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('firo_admin_logged_in', 'true');
        showAdminPanel();
    } else {
        alert('❌ كلمة المرور غير صحيحة!');
        document.getElementById('passwordInput').value = '';
    }
}

// ========== التحقق من حالة تسجيل الدخول ==========
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('firo_admin_logged_in');
    
    if (isLoggedIn === 'true') {
        showAdminPanel();
    }
}

// ========== إظهار لوحة التحكم ==========
function showAdminPanel() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadAdminProducts();
}

// ========== تسجيل الخروج ==========
function logout() {
    localStorage.removeItem('firo_admin_logged_in');
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('passwordInput').value = '';
}

// ========== معاينة الصورة ==========
document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('productImage');
    
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const preview = document.getElementById('imagePreview');
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
});

// ========== نشر منتج جديد ==========
function publishProduct() {
    // جلب البيانات من النموذج
    const name = document.getElementById('productName').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    const featured = document.getElementById('productFeatured').checked;
    const imageFile = document.getElementById('productImage').files[0];
    
    // التحقق من البيانات
    if (!name || !description || !price || !imageFile) {
        alert('⚠️ من فضلك أكمل كل البيانات المطلوبة!');
        return;
    }
    
    // تحويل الصورة إلى Base64
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const productData = {
            name: name,
            description: description,
            price: price,
            category: category,
            image: e.target.result, // الصورة Base64
            featured: featured
        };
        
        // إضافة المنتج
        addProduct(productData);
        
        // مسح النموذج
        clearForm();
        
        // تحديث القائمة
        loadAdminProducts();
        
        alert('✅ تم نشر المنتج بنجاح!');
    };
    
    reader.readAsDataURL(imageFile);
}

// ========== مسح النموذج ==========
function clearForm() {
    document.getElementById('productName').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productCategory').value = 'مكرميات حائط';
    document.getElementById('productFeatured').checked = false;
    document.getElementById('productImage').value = '';
    document.getElementById('imagePreview').style.display = 'none';
}

// ========== تحميل المنتجات في لوحة التحكم ==========
function loadAdminProducts() {
    const products = getProducts();
    const productList = document.getElementById('adminProductList');
    
    if (!productList) return;
    
    if (products.length === 0) {
        productList.innerHTML = `
            <div class="empty-message" style="grid-column: 1/-1;">
                <p style="font-size: 3em; margin-bottom: 20px;">📦</p>
                <h3>مفيش منتجات منشورة حالياً</h3>
                <p>ابدأ في نشر منتجاتك الجديدة!</p>
            </div>
        `;
        return;
    }
    
    productList.innerHTML = products.map(product => `
        <div class="admin-product-card">
            <img src="${product.image}" alt="${product.name}">
            <div class="admin-product-info">
                <h3>${product.name}</h3>
                <p class="price">${product.price} جنيه</p>
                <p style="font-size: 0.85em; color: #666; margin-bottom: 10px;">${product.category}</p>
                ${product.featured ? '<span style="background: #F5F5DC; padding: 3px 10px; border-radius: 15px; font-size: 0.8em; display: inline-block; margin-bottom: 10px;">⭐ مميز</span>' : ''}
                <button class="delete-btn" onclick="deleteAdminProduct(${product.id})">🗑️ حذف</button>
            </div>
        </div>
    `).join('');
}

// ========== حذف منتج من لوحة التحكم ==========
function deleteAdminProduct(id) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        deleteProduct(id);
        loadAdminProducts();
        alert('✅ تم حذف المنتج بنجاح!');
    }
}