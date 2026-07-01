const PRODUCT_STORAGE_KEY = 'web-prac-products';
const SEARCH_KEYWORD_KEY = 'web-prac-keyword';

const productForm = document.getElementById('product-form');
const productNameInput = document.getElementById('product-name');
const productPriceInput = document.getElementById('product-price');
const formMessage = document.getElementById('form-message');
const searchInput = document.getElementById('search-input');
const productList = document.getElementById('product-list');
const resetButton = document.getElementById('reset-button');
const storageStatus = document.getElementById('storage-status');

const defaultProducts = [
  { id: 1, name: '기계식 키보드', price: 89000 },
  { id: 2, name: '무선 마우스', price: 39000 },
  { id: 3, name: '27인치 모니터', price: 240000 }
];

function saveProductsToStorage(products) {
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
}

function loadProductsFromStorage() {
    const products = localStorage.getItem(PRODUCT_STORAGE_KEY);
    if (products === null) {
        return defaultProducts;
    }

    try {
        return JSON.parse(products);
    } catch (error) {
        console.log('에러');
        return defaultProducts;
    }
}

function createProductCard(product) {
    const card = document.createElement('article');
    card.classList.add('product-card');

    const title = document.createElement('h3');
    title.textContent = product.name;

    const price = document.createElement('p');
    price.textContent = product.price;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = "삭제";
    deleteButton.dataset.id = product.id;

    card.appendChild(title);
    card.appendChild(price);
    card.appendChild(deleteButton);

    return card;
}

function renderProducts(products) {
    productList.innerHTML = '';

    for (const product of products) {
        const card = createProductCard(product);
        productList.appendChild(card);
    }
}

function saveSearchKeyword(keyword) {
    sessionStorage.setItem(SEARCH_KEYWORD_KEY, keyword)
}

function loadSearchKeyword() {
    const savedKyword = sessionStorage.getItem(SEARCH_KEYWORD_KEY);
    if (savedKyword === null) {
        return '';
    }
    return savedKyword;
}

function  clearSearchKeyword() {
    sessionStorage.removeItem(SEARCH_KEYWORD_KEY);
}

let products = loadProductsFromStorage();

function getFilteredProducts(keyword) {
    const normalKeyword = keyword.trim().toLowerCase();
    if (normalKeyword === '') {
        return products;
    }

    return products.filter((product) => {
        return product.name.toLowerCase().includes(normalKeyword);
    })
}

const savedKyword = loadSearchKeyword();
searchInput.value = savedKyword;
renderProducts(getFilteredProducts(savedKyword));

productForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const productName = productNameInput.value.trim();
    const productPrice = Number(productPriceInput.value);

    const newProduct = {
        id: Date.now(),
        name: productName,
        price: productPrice
    }

    products.push(newProduct);
    saveProductsToStorage(products);

    const keyword = searchInput.value;
    console.log(keyword);
    renderProducts(getFilteredProducts(keyword));

    productForm.reset();
})

productList.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-button')) {
        const productId = Number(event.target.dataset.id);
        products = products.filter((product) => product.id !== productId);

        saveProductsToStorage(products);
        const keyword = searchInput.value;
        renderProducts(getFilteredProducts(keyword));
    }
})

resetButton.addEventListener('click', () => {
    const isConfirmed = confirm('저장된 상품을 초기화 하겠습니까?');
    
    if (isConfirmed) {
        localStorage.removeItem(PRODUCT_STORAGE_KEY);
        clearSearchKeyword();
        products = [];
        searchInput.value = '';
        renderProducts(products);
    }
})