// ==========================================
// 1. DOM 요소 선택
// ==========================================
// TODO: 폼(form), 날짜, 주제, 내용, 난이도 입력창을 ID로 선택하세요.
// TODO: 검색창 요소와 카드가 추가될 리스트 컨테이너 요소를 선택하세요.
const tilForm = document.getElementById('til-form');
const tilDate = document.getElementById('til-date');
const tilSubject = document.getElementById('til-subject');
const tilContent = document.getElementById('til-content');
const tilLevel = document.getElementById('til-level');

const searchInput = document.getElementById('search-input');
const tilListContainer = document.getElementById('til-list');

// ==========================================
// 2. 상태 데이터 (localStorage 연동)
// ==========================================
// TODO: localStorage에서 'tilArticles' 데이터를 읽어와 배열로 초기화합니다. (없으면 빈 배열)
// TODO: (선택) 날짜 입력창의 value 기본값을 오늘 날짜로 설정해보세요.
let tilList = JSON.parse(localStorage.getItem('tilArticles')) || [];
const now = new Date();
const offset = now.getTimezoneOffset() * 60000;
const localDate = new Date(now.getTime() - offset).toISOString().substring(0, 10);
tilDate.value = localDate;

// ==========================================
// 3. 단일 카드 요소 생성 함수 (Create)
// ==========================================
function createTilCard(article) {
  // TODO: 1. 카드(article) 요소 생성 및 클래스('til-card'), 고유 id(dataset.id) 부여
  const tilArticle = document.createElement('article');
  tilArticle.classList.add('til-card');
  // TODO: 2. 제목과 배지를 묶을 상단 헤더 영역(div) 생성 및 클래스('til-header') 부여
  const tilDiv = document.createElement('div');
  tilDiv.classList.add('til-header');
  // TODO: 3. 주제(h3), 난이도 배지(span) 생성 후 텍스트/클래스 부여
  const h3 = document.createElement('h3');
  h3.textContent = article.subject;
  h3.classList.add('til-subject');
  
  const span = document.createElement('span');
  span.textContent = article.badge;
  span.classList.add('badge', `badge-${article.badge}`);
  // TODO: 4. 주제와 배지를 헤더 영역(div)에 조립(appendChild)
  tilDiv.appendChild(h3);
  tilDiv.appendChild(span);
  // TODO: 5. 작성일(div), 본문 내용(p), 삭제 버튼(button) 각각 생성 및 내용 채우기
  const creatDiv = document.createElement('div');
  creatDiv.textContent = article.date;

  const contentText = document.createElement('p');
  contentText.textContent = article.content;

  const deleteButton = document.createElement('button');
  deleteButton.type = "button";
  deleteButton.textContent = '삭제';
  deleteButton.classList.add('delete-btn')
  deleteButton.dataset.id = article.id;
  // TODO: 6. 헤더 영역, 작성일, 본문, 삭제 버튼을 카드(article)에 차례대로 조립
  tilArticle.appendChild(tilDiv);
  tilArticle.appendChild(creatDiv);
  tilArticle.appendChild(contentText);
  tilArticle.appendChild(deleteButton);
  // TODO: 7. 완성된 카드 요소를 반환(return)
  return tilArticle;
}

// ==========================================
// 4. 전체 목록 렌더링 함수 (Render)
// ==========================================
function renderTIL(articles) {
  // TODO: 1. 리스트 컨테이너 내부(innerHTML)를 깨끗이 비웁니다.
  tilListContainer.innerHTML = "";
  // TODO: 2. 배열(articles)이 비어있다면 '결과가 없습니다' 메시지 요소를 만들어 넣고 종료(return)합니다.
  if (arguments.length === 0) {
    const notResult = document.createElement('div');
    notResult.textContent = '결과가 없습니다';
    tilList.appendChild(notResult);
  }
  // TODO: 3. 배열을 역순으로 정렬(최신글이 위로)한 뒤 for...of 문으로 순회합니다.
  for(const article of [...articles].reverse()) {
    // TODO: 4. 순회할 때마다 createTilCard()를 호출해 카드를 만들고, 리스트 컨테이너에 추가합니다.
    tilListContainer.appendChild(createTilCard(article));
  }
}

// ==========================================
// 5. 폼 제출 이벤트 (추가)
// ==========================================
// TODO: 폼에 'submit' 이벤트를 달고 기본 동작을 막습니다(preventDefault).
tilForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const inputValue = searchInput.value.trim();
  const til = {
    id: Date.now(),
    date: tilDate.value,
    subject: tilSubject.value,
    content: tilContent.value,
    badge: tilLevel.value,
  };
  tilList.push(til);
  localStorage.setItem('tilArticles', JSON.stringify(tilList));
  renderTIL(tilList);
  tilSubject.value = '';
  tilContent.value = '';

})
// TODO: 입력값들을 모아 새 객체를 만들고 배열에 추가(push)합니다.
// TODO: localStorage에 동기화하고 화면을 갱신(render)한 뒤 입력창을 비웁니다.

// ==========================================
// 6. 삭제 기능 (이벤트 위임)
// ==========================================
// TODO: 리스트 컨테이너에 'click' 이벤트를 답니다.
tilListContainer.addEventListener('click', (event) => {
  if(event.target.classList.contains('delete-btn')) {
      const targetId = Number(event.target.dataset.id);
      tilList = tilList.filter(til => til.id !== targetId);
      localStorage.setItem('tilArticles', JSON.stringify(tilList));
      renderTIL(tilList);
  }
})
// TODO: 클릭된 요소(event.target)가 '삭제 버튼'이면 dataset.id를 가져와 배열에서 제거(filter)합니다.
// TODO: localStorage에 동기화하고 화면을 다시 렌더링합니다.

// ==========================================
// 7. 검색 기능 및 초기화
// ==========================================
// TODO: 검색창에 'keydown' 이벤트를 달고, 'Enter' 키일 때만 필터링 로직이 돌게 합니다.
searchInput.addEventListener('keydown', (event) => {
  if(event.key === 'Enter') {
    const newList = tilList.filter((til) => 
      til.subject.trim().includes(searchInput.value) || 
      til.content.trim().includes(searchInput.value));
    renderTIL(newList);
  }
})
// TODO: 검색어는 sessionStorage에 저장하고, DOMContentLoaded 이벤트 시 복원하여 초기 렌더링을 실행합니다.
window.addEventListener('DOMContentLoaded', () => {
    const savedKyword = sessionStorage.getItem('bucketSearchKeyword') || '';
    searchInput.value = savedKyword;
    renderTIL(tilList);
});