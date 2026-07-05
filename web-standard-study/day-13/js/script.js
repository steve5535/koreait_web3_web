// ==========================================myBucketList
// 1. DOM 요소 선택
// ==========================================
// TODO: 폼, 카테고리 선택창, 입력창, 검색창, 리스트 컨테이너(ul) 요소를 선택하세요.
const buckeForm = document.getElementById("bucket-form");
const bucketCategory = document.getElementById("bucket-category");
const buckeInput = document.getElementById("bucket-input");
const searchInput = document.getElementById("search-input");
const bucketListContainer = document.getElementById("bucket-list");


// ==========================================
// 2. 상태 데이터 (localStorage 연동)
// ==========================================
// TODO: localStorage에서 'myBucketList' 데이터를 가져옵니다. 없으면 빈 배열로 초기화하세요.
let bucketList = JSON.parse(localStorage.getItem('myBucketList')) || [];
// ==========================================
// 3. 단일 리스트 아이템 생성 함수 (Create)
// ==========================================
function createBucketItem(item) {
  // TODO: 1. 항목(li) 요소 생성 및 클래스('bucket-item'), 고유 id(dataset.id) 부여
  const li = document.createElement('li');
  li.classList.add('bucket-item');
  li.dataset.id = item.id;
  // TODO: 2. 완료 상태(item.done)가 true면 li에 'done' 클래스 추가
  if (item.done) {
    li.classList.add('done');
  }
  // TODO: 3. 텍스트들을 묶어줄 영역(div) 생성 및 클래스('item-content') 부여
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('item-content');
  // TODO: 4. 카테고리 배지(span), 내용(span) 생성 후 텍스트/클래스 부여
  const badge = document.createElement('span');
  badge.classList.add('category-badge');
  badge.textContent = item.category;

  const content = document.createElement('span');
  content.classList.add('item-text');
  content.textContent = item.text;
  // TODO: 5. 배지와 내용을 div에 조립
  contentDiv.appendChild(badge);
  contentDiv.appendChild(content);
  // TODO: 6. 삭제 버튼(button) 생성 및 클래스('delete-btn'), 고유 id 부여
  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.classList.add('delete-btn');
  deleteButton.textContent = '삭제';
  deleteButton.dataset.id = item.id;
  // TODO: 7. 완성된 div와 삭제 버튼을 최상위 li에 조립
  li.appendChild(contentDiv);
  li.appendChild(deleteButton);
  // TODO: 8. 완성된 li 요소를 반환(return)
  return li;
}

// ==========================================
// 4. 전체 목록 렌더링 함수 (Render)
// ==========================================
function renderBucketList(items) {
  // TODO: 1. 리스트 컨테이너(innerHTML)를 비웁니다.
  bucketListContainer.innerHTML = '';
  // TODO: 2. 항목이 없으면 빈 상태를 알리는 li를 만들어 넣고 리턴합니다.
  // TODO: 3. for...of 문으로 items 배열을 순회하며 createBucketItem()으로 li를 만듭니다.
  for (const item of items) {
    const li = createBucketItem(item);
    bucketListContainer.appendChild(li);
  }
  // TODO: 4. 만들어진 li를 컨테이너에 추가합니다.
}

// ==========================================
// 5. 폼 제출 이벤트 (추가)
// ==========================================
// TODO: 폼에 'submit' 이벤트를 달고 기본 동작을 막습니다.
buckeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    // TODO: 입력값으로 새 객체(done: false)를 만들고 배열에 추가 후 localStorage에 저장합니다.
    const newItem = {
        id: Date.now(),
        text: buckeInput.value,
        category: bucketCategory.value,
        done: false
    };
    bucketList.push(newItem);
    // TODO: 화면을 갱신하고 입력창을 비웁니다.
    
    localStorage.setItem('myBucketList', JSON.stringify(bucketList));

    filterAndRender();
    buckeInput.value = '';

})

// ==========================================
// 6. 삭제 및 완료 토글 (이벤트 위임)
// ==========================================
// TODO: 리스트 컨테이너에 'click' 이벤트를 답니다.
// TODO: 클릭 위치에서 가장 가까운 버킷리스트 항목(li)을 찾고(closest) id를 가져옵니다.
// TODO: 클릭된 게 '삭제 버튼'이면 배열에서 필터링(filter)하여 지웁니다.
// TODO: 클릭된 게 다른 영역이면 배열을 순회(map)하며 해당 id의 done 상태를 반전시킵니다.
// TODO: localStorage 동기화 후 화면을 다시 렌더링합니다.
bucketListContainer.addEventListener('click', (event) => {
    const liElement = event.target.closest('.bucket-item');

    const targetId = Number(liElement.dataset.id);

    if(event.target.classList.contains('delete-btn')) {
        bucketList = bucketList.filter(item => 
            item.id !== targetId);
    } else {
        bucketList = bucketList.map(item => {
            if(item.id === targetId) {
                return {
                    ...item,
                    done: !item.done
                };
            }
            return item;
        });
    }

    localStorage.setItem('myBucketList', JSON.stringify(bucketList));
    filterAndRender();
})

// ==========================================
// 7. 검색 기능 및 초기화
// ==========================================
// TODO: 검색창에 'keydown' 이벤트를 달고, 'Enter' 입력 시 필터링이 되게 합니다.
function filterAndRender() {
    const keyword = searchInput.value.trim().toLowerCase();
    sessionStorage.setItem('bucketSearchKeyword', keyword);

    const filtereData = bucketList.filter(item =>
        item.text.toLowerCase().includes(keyword) ||
        item.category.includes(keyword)
    )

    renderBucketList(filtereData);
}

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        filterAndRender();
    }
});
// TODO: DOMContentLoaded 발생 시 sessionStorage 검색어를 복원하고 렌더링합니다.
window.addEventListener('DOMContentLoaded', () => {
    const savedKyword = sessionStorage.getItem('bucketSearchKeyword') || '';
    searchInput.value = savedKyword;
    filterAndRender();
});