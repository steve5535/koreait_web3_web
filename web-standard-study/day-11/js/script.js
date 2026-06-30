function createProductCard(product) {
    const card = document.createElement('article');
    card.classList.add('product-card');

    card.dataset.id = product.id;

    const title = document.createElement('h3');
    title.textContent = product.name;

    const price = document.createElement('p');
    price.textContent = product.price;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = '삭제';
    deleteButton.classList.add('delete-button');

    deleteButton.dataset.id = product.id;

    card.appendChild(title);
    card.appendChild(price);
    card.appendChild(deleteButton);

    return card;
}

function renderProducts(products) {
    const productList = document.getElementById('product-list');

    productList.innerHTML = '';

    for (const product of products) {
        const card = createProductCard(product);
        productList.appendChild(card);
    }
}

let products = [
  { id: 1, name: '기계식 키보드', price: 89000 },
  { id: 2, name: '무선 마우스', price: 39000 },
  { id: 3, name: '27인치 모니터', price: 240000 }
];

renderProducts(products);

const productList = document.getElementById('product-list');

productList.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-button')) {
        const productId = Number(event.target.dataset.id);
        products = products.filter((product) => product.id !== productId);
        renderProducts(products);
    }
})

const productForm = document.getElementById('product-form');
const productNameInput = document.getElementById('product-name');
const productPriceInput = document.getElementById('product-price');
const formMessage = document.getElementById('form-message');

productForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const productName = productNameInput.value.trim();
    const productPrice = Number(productPriceInput.value);

    const newProduct = {
        id: Date.now(),
        name: productName,
        price: productPrice
    }
    console.log(newProduct);
    

    products.push(newProduct);
    renderProducts(products);
    
    formMessage.textContent = '상품이 추가되었습니다.';
    formMessage.classList.add('success');
    formMessage.classList.add('error');

    productForm.reset();
})

const searchInput = document.getElementById('search-input');
searchInput.addEventListener('change', (event) => {
    const keyword = event.target.value.trim().toLowerCase();

    const filterProducts = products.filter((product) => {
        return product.name.toLowerCase().includes(keyword);
    })

    renderProducts(filterProducts);
})