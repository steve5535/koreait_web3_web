
function creatProductCard(product) {
    const productCard = document.createElement('article');
    productCard.classList.add('product-card');

    const productName = document.createElement('h3');
    productName.textContent = product.name;

    const price = document.createElement('p');
    price.textContent = product.price;

    const stock = document.createElement('p')
    stock.textContent = product.stockCount;

    const productStatus = document.createElement('p');

    if (product.stockCount > 0 ) {
        productStatus.textContent = '판매중';
        productStatus.classList.add('success');
    } else {
        productStatus.textContent = '품절';
        productStatus.classList.add('highlight');
        productCard.classList.add('sold-out');
    }

    if (product.isOnSale) {
        const saleBadge = document.createElement('span')
        saleBadge.textContent = "할인 중!";
        saleBadge.classList.add('sale-badge');
        price.appendChild(saleBadge);
    }

    productCard.appendChild(productName);
    productCard.appendChild(price);
    productCard.appendChild(stock);
    productCard.appendChild(productStatus);
    

    return productCard;
}

function renderProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    for (const product of products) {
        const productCard = creatProductCard(product);
        productList.appendChild(productCard);
    }
}

const products = [
  { id: 1, name: '기계식 키보드', price: 89000, stockCount: 10, isOnSale: true },
  { id: 2, name: '무선 마우스', price: 39000, stockCount: 0, isOnSale: false },
  { id: 3, name: '27인치 모니터', price: 240000, stockCount: 5, isOnSale: true },
  { id: 4, name: 'USB 허브', price: 25000, stockCount: 15, isOnSale: false }
];

renderProducts(products);