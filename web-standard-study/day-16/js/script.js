const API_BASE_URL = 'https://dummyjson.com/products';
const PRODUCT_FIELDS = 'title,price,thumbnail,rating,stock,category,discountPercentage';
const PRODUCT_LIMIT = 12;
const statusMessage = document.getElementById('status-message');
const productList = document.getElementById('product-list');
const resultCount = document.getElementById('result-count');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');

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
loadProductsByCategory('laptops');

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