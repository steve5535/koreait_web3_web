const API_BASE_URL = 'https://dummyjson.com/products';
const PRODUCT_FIELDS = 'title,price,thumbnail,rating,stock,category,discountPercentage';
const PRODUCT_LIMIT = 12;
const statusMessage = document.getElementById('status-message');
const productList = document.getElementById('product-list');
const resultCount = document.getElementById('result-count');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');
const productDetail = document.getElementById('product-detail');

async function loadProducts() {
  try {
    setStatus('상품 데이터를 불러오는 중입니다..')
    const data = await fetchJson(`${API_BASE_URL}?limite=${PRODUCT_LIMIT}&select=${PRODUCT_FIELDS}`);
    renderProducts(data.products);
    setStatus('상품 데이터를 불러 왔습니다.', 'success');
  } catch (error) {
    console.log("에러발생");
    setStatus(error.message, 'error');
  }
}

async function serchProduct(keyword) {
  try {
    setStatus('상품 데이터를 불러오는 중입니다..')
    const url = `${API_BASE_URL}/search?q=${encodeURIComponent(keyword)}&limit=${PRODUCT_LIMIT}&select=${PRODUCT_FIELDS}`;

    const data = await fetchJson(url);
    renderProducts(data.products);
    setStatus('상품 데이터를 불러 왔습니다', 'success');
  } catch (error) {
    setStatus(error.message, 'error');
  }
}

async function fetchJson(url) {
    const response = await fetch(url);
    if(!response.ok) {
      throw new Error('상품 데이터를 불러오지 못했습니다.');
    }
    return await response.json();
}


function renderCategoryOptions(categories) {
  categorySelect.innerHTML = '<option value="">전체 카테고리</option>';
  for(const category of categories) {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  }
}

async function loadCategories() {
  try {
    const categories = await fetchJson(`${API_BASE_URL}/category-list`);
    renderCategoryOptions(categories);
  } catch (error) {
    setStatus(error.message, 'error');
  }
}

async function loadProductsByCategory(category) {
  try {
    setStatus(`${category} 카테고리 상품을 불러오는 중입니다.`);
    const url = `${API_BASE_URL}/category/${category}?limit=${PRODUCT_LIMIT}&select=${PRODUCT_FIELDS}`;
    const data = await fetchJson(url);

    renderProducts(data.products);

    setStatus(`${category} 카테고리 상품을 불러오는 중입니다.`, 'success');
  } catch (error) {
    setStatus(error.message, 'error');
  }
}

loadCategories();

const resetButton = document.getElementById('reset-button');

resetButton.addEventListener('click', () => {
  searchInput.value = '';
  categorySelect.value = '';
  productDetail.classList.add('empty-detail');
  productDetail.textContent = '상품 카드에서 상세 보기 버튼을 클릭하면 상세 정보가 표시됩니다.';

  loadProducts();
})


productList.addEventListener('click', (event) => {
  if (event.target.classList.contains('detail-button')) {
    const productId = event.target.dataset.id;
    loadProductDetail(productId);
  }
})

async function loadProductDetail(productId) {
  try {
    setStatus("상품 상세 정보를 불러오는 중입니다.");
    const product = await fetchJson(`${API_BASE_URL}/${productId}`);

    renderProductDetail(product);
    setStatus('상품 상세 정보를 불러왔습니다.', 'success')
  } catch (error) {
    setStatus(error.message, 'error');
  }
}

function renderProductDetail(product) {
  productDetail.classList.remove('empty-detail');
  productDetail.innerHTML = `
    <div class="detail-layout">
      <div>
        <img class="detail-image" src="${product.thumbnail}" alt="${product.title}">
      </div>
      <div>
        <h3 class="detail-title">${product.title}</h3>
        <p>${product.description}</p>
        <p>가격: $${product.price.toLocaleString()}</p>
        <p>카테고리:${product.category}</p>
        <p>평점:${product.rating}</p>
        <p>재고:${product.stock}개</p>
        <p>할인율:${product.discountPercentage}%</p>
        <p>배송 정보:${product.shippingInformation}</p>
        <p>반품 정책:${product.returnPolicy}</p>
      </div>
    </div>
  `;
}

categorySelect.addEventListener('change', (event) => {
  const category = event.target.value;

  searchInput.value = '';
  if (category === '') {
    loadProducts();
    return;
  }
  loadProductsByCategory(category);
})

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const keyword = searchInput.value.trim();

  if (keyword === '') {
    setStatus('검색어를 입력해주세요', 'error');
    return;
  }

  serchProduct(keyword);
})

function setStatus(message, type = '') {
  statusMessage.textContent = message;
  statusMessage.classList.remove('sucess', 'error');
  if (type !== '') {
    statusMessage.classList.add(type);
  }
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.classList.add('product-card');

  const image = document.createElement('img');
  image.classList.add('product-image');
  image.src = product.thumbnail;
  image.alt = product.title;

  const body = document.createElement('div');
  body.classList.add('product-card-body');

  const title = document.createElement('h3');
  title.textContent = product.title;

  const price = document.createElement('p');
  price.textContent = `가격: $${product.price.toLocaleString()}`;

  const category = document.createElement('p');
  category.classList.add('product-meta');
  category.textContent = `카테고리:${product.category}`;

  const rating = document.createElement('p');
  rating.classList.add('product-meta');
  rating.textContent = `평점:${product.rating}`;

  const stock = document.createElement('p');
  stock.classList.add('product-meta');
  stock.textContent = `재고:${product.stock}개`;

  const discount = document.createElement('p');
  discount.classList.add('product-meta');
  discount.textContent = `할인율:${product.discountPercentage}%`;

  const actions = document.createElement('div');
  actions.classList.add('product-actions');

  const detailButton = document.createElement('button');
  detailButton.type = 'button';
  detailButton.classList.add('detail-button');
  detailButton.dataset.id = product.id;
  detailButton.textContent = '상세 보기';

  body.appendChild(title);
  body.appendChild(price);
  body.appendChild(category);
  body.appendChild(rating);
  body.appendChild(stock);
  body.appendChild(discount);

  actions.appendChild(detailButton);

  card.appendChild(image);
  card.appendChild(body);
  card.appendChild(actions);

  return card;
}

function renderProducts(products) {
  productList.innerHTML = '';
  resultCount.textContent = `총${products.length}개 상품`;

  if (products.length === 0) {
    productList.innerHTML = '<p class="empty-message">표시할 상품이 없습니다.</p>';
    return;
  }

  for (const product of products) {
    const card = createProductCard(product);
    productList.appendChild(card);
  }
}