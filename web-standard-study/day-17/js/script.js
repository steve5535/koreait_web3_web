/*
  ==================================================
  학생용 시간표 웹 app.js 실습 가이드
  ==================================================

  이 파일은 완성 코드가 아닙니다.

  수강생이 직접 구현해야 하는 부분은
  각 함수 안에 TODO 주석으로 안내되어 있습니다.

  선생님이 미리 제공해주는 것
  --------------------------------------------------
  1. HTML 요소 가져오기
  2. 기본 변수 세팅
  3. 함수 이름
  4. 함수 실행 순서
  5. 함수 안에서 해야 할 일 설명

  수강생이 직접 해야 하는 것
  --------------------------------------------------
  1. 배열 반복하기
  2. 조건문 작성하기
  3. 날짜 계산하기
  4. HTML 문자열 만들기
  5. localStorage 저장/불러오기 구현하기


  데이터는 data.js 안의 window.timetableData를 사용합니다.
*/

/* ==================================================
   1단계. HTML 요소 가져오기
   --------------------------------------------------
   getElementById 쓰는 건 반복적이고 귀찮으므로
   여기까지는 미리 작성해둡니다.

   주의:
   아래 id 이름은 index.html에 있는 id와 반드시 같아야 합니다.
================================================== */

// 반 선택 select
const classSelect = document.getElementById("class-select");

// 날짜 선택 input
const dateInput = document.getElementById("date-input");

// 선택과목 입력 input 3개
const subject1Input = document.getElementById("subject1");
const subject2Input = document.getElementById("subject2");
const subject3Input = document.getElementById("subject3");

// 선택과목 자동완성 datalist
const subjectOptions = document.getElementById("subject-options");

// 페이지 제목
const pageTitle = document.getElementById("page-title");

// 현재 주차 표시
const weekLabel = document.getElementById("weekLabel");

// 현재 선택한 선택과목 안내 문구
const selectedInfo = document.getElementById("selected-info");

// 시간표 테이블 thead, tbody
const tableHead = document.getElementById("tableHead");
const tableBody = document.getElementById("tableBody");

// 주차 이동 버튼
const prevWeekBtn = document.getElementById("prevWeekBtn");
const nextWeekBtn = document.getElementById("nextWeekBtn");
const firstWeekBtn = document.getElementById("firstWeekBtn");

// 오늘의 메모
const memoInput = document.getElementById("memo-input");
const memoStatus = document.getElementById("memo-status");

/* ==================================================
   2단계. 기본 데이터 준비하기
   --------------------------------------------------
   data.js에서 window.timetableData라는 이름으로
   시간표 데이터가 들어왔다고 가정합니다.

   데이터 예시:

   {
     semester: 1,
     date: "2026-03-02",
     classroomName: "1",
     period: 2,
     content: "대체공휴일"
   }

   여기서 사용할 주요 값:
   --------------------------------------------------
   semester      학기
   date          시간표 날짜
   classroomName 반 이름 또는 선택과목 강의실명
   period        교시
   content       수업내용
================================================== */

// 전체 시간표 데이터
const timetableData = window.timetableData;

// 월요일부터 금요일까지만 보여줄 예정
const dayNames = ["월", "화", "수", "목", "금"];

// 1교시부터 7교시까지만 보여줄 예정
const periods = [1, 2, 3, 4, 5, 6, 7];

// 선택과목 input 3개를 배열로 묶어둔다.
// 이렇게 하면 나중에 반복문으로 처리하기 편하다.
const subjectInputs = [subject1Input, subject2Input, subject3Input];

/* ==================================================
   3단계. localStorage key 이름 준비하기
   --------------------------------------------------
   localStorage에 값을 저장할 때는 key가 필요합니다.

   예:
   localStorage.setItem("저장할이름", "저장할값");

   key 이름을 아무렇게나 만들면 다른 기능과 겹칠 수 있으므로
   프로젝트 이름을 앞에 붙여서 구분합니다.
================================================== */

const STORAGE_CLASS = "studentTimetable_class";
const STORAGE_DATE = "studentTimetable_date";
const STORAGE_SUBJECT1 = "studentTimetable_subject1";
const STORAGE_SUBJECT2 = "studentTimetable_subject2";
const STORAGE_SUBJECT3 = "studentTimetable_subject3";
const STORAGE_MEMO = "studentTimetable_memo";

/* ==================================================
   4단계. 처음 실행 함수
   --------------------------------------------------
   페이지가 처음 열렸을 때 실행할 함수입니다.

   이 함수 안에서 아래 순서대로 실행되게 만드세요.

   실행 순서:
   --------------------------------------------------
   1. 반 선택 목록 만들기
   2. 선택과목 자동완성 목록 만들기
   3. 날짜 기본값 넣기
   4. localStorage에 저장된 값 불러오기
   5. 메모 불러오기
   6. 이벤트 연결하기
   7. 시간표 화면 그리기

   힌트:
   --------------------------------------------------
   함수는 이미 아래에 만들어져 있습니다.
   이 함수 안에서는 필요한 함수들을 순서대로 호출하면 됩니다.
================================================== */

function init() {
  // TODO 1. makeClassOptions 함수를 실행하세요.
  makeClassOptions();
  // TODO 2. makeSubjectOptions 함수를 실행하세요.
  makeSubjectOptions();
  // TODO 3. setDefaultDate 함수를 실행하세요.
  setDefaultDate();
  // TODO 4. loadSavedControls 함수를 실행하세요.
  loadSavedControls();
  // TODO 5. loadSavedMemo 함수를 실행하세요.
  loadSavedMemo();
  // TODO 6. addEvents 함수를 실행하세요.
  addEvents();
  // TODO 7. renderTimetable 함수를 실행하세요.
  renderTimetable();
}

/* ==================================================
   5단계. 이벤트 연결하기
   --------------------------------------------------
   사용자가 화면에서 어떤 행동을 했을 때
   어떤 함수가 실행될지 연결합니다.

   연결해야 할 이벤트:
   --------------------------------------------------
   1. 반 선택 변경
   2. 날짜 변경
   3. 선택과목 1 입력
   4. 선택과목 2 입력
   5. 선택과목 3 입력
   6. 이전 주 버튼 클릭
   7. 다음 주 버튼 클릭
   8. 첫 주 버튼 클릭
   9. 메모 입력

   구현 힌트:
   --------------------------------------------------
   요소.addEventListener("이벤트이름", function () {
     실행할 코드
   });

   반, 날짜, 선택과목이 바뀌었을 때는
   --------------------------------------------------
   1. localStorage에 저장
   2. 시간표 다시 그리기

   이 두 가지가 필요합니다.
================================================== */

function addEvents() {
  // TODO. 반 선택이 변경되었을 때 실행할 이벤트를 연결하세요.
  classSelect.addEventListener("change", (event) => {
    localStorage.setItem(STORAGE_CLASS, event.target.value);
  });
  // 힌트:
  // classSelect.addEventListener("change", function () {
  //   1. 입력값 저장 함수 호출
  //   2. 시간표 다시 그리는 함수 호출
  // });

  // TODO. 날짜가 변경되었을 때 실행할 이벤트를 연결하세요.
  dateInput.addEventListener("change", (event) => {
    localStorage.setItem(STORAGE_DATE, event.target.value);
  });

  // TODO. 선택과목 input 3개에 input 이벤트를 연결하세요.
  // 힌트:
  // subjectInputs 배열을 forEach로 반복하면 편합니다.
  subjectInputs.forEach((subject, index) => {
    subject.addEventListener("change", (event) => {
      const key = `STORAGE_SUBJECT${index + 1}`;
      const value = event.target.value;

      localStorage.setItem(key, value);
    });
  });

  // TODO. 이전 주 버튼 클릭 이벤트를 연결하세요.
  // 힌트:
  // moveWeek 함수에 -7을 전달하면 됩니다.

  // TODO. 다음 주 버튼 클릭 이벤트를 연결하세요.
  // 힌트:
  // moveWeek 함수에 7을 전달하면 됩니다.

  // TODO. 첫 주 버튼 클릭 이벤트를 연결하세요.
  // 힌트:
  // 1. 날짜를 첫 날짜로 바꾼다.
  // 2. 저장한다.
  // 3. 시간표를 다시 그린다.

  // TODO. 메모 입력 이벤트를 연결하세요.
  // 힌트:
  // 1. memoInput.value를 localStorage에 저장한다.
  // 2. memoStatus에 "저장됨" 같은 문구를 보여준다.
  memoInput.addEventListener("change", (event) => {
    memoStatus.textContent = "저장됨";
  });
}
addEvents();

/* ==================================================
   6단계. 반 선택 목록 만들기
   --------------------------------------------------
   시간표 데이터에서 일반 반만 뽑아서
   classSelect 안에 option으로 추가합니다.

   데이터 안에는 classroomName이 이런 식으로 들어있을 수 있습니다.

   일반 반:
   --------------------------------------------------
   "1"
   "2"
   "3"

   선택과목 강의실:
   --------------------------------------------------
   "선택1"
   "선택2"
   "선택3"

   여기서 반 선택 목록에는
   "1", "2", "3" 같은 일반 반만 넣어야 합니다.

   처리 순서:
   --------------------------------------------------
   1. 빈 배열 classNames를 만든다.
   2. timetableData를 반복한다.
   3. item.classroomName을 가져온다.
   4. classroomName이 "선택"으로 시작하는지 확인한다.
   5. "선택"으로 시작하면 배열에 넣지 않는다.
   6. 일반 반이면 배열에 넣는다.
   7. 이미 들어있는 반이면 중복으로 넣지 않는다.
   8. 반 목록을 숫자 기준으로 정렬한다.
   9. option 태그를 만들어 classSelect에 넣는다.

   필요한 문법 힌트:
   --------------------------------------------------
   배열.includes(값)
   문자열.startsWith("선택")
   배열.sort()
   select.innerHTML
================================================== */

function makeClassOptions() {
  // TODO. 일반 반 이름을 담을 빈 배열을 만드세요.
  let classNames = [];
  // TODO. timetableData를 반복하면서 classroomName을 확인하세요.
  // TODO. 중복되지 않는 반 이름만 배열에 추가하세요.
  timetableData.forEach((tableInfo) => {
    // TODO. "선택"으로 시작하는 classroomName은 제외하세요.
    if (
      !tableInfo.classroomName.startsWith("선택") &&
      !classNames.includes(tableInfo.classroomName)
    ) {
      classNames.push(tableInfo.classroomName);
    }
  });
  // TODO. 반 이름을 숫자 기준으로 정렬하세요.
  classNames.sort();
  // TODO. classSelect 안에 option 태그를 추가하세요.
  classNames.forEach((className) => {
    const classOption = document.createElement("option");
    classOption.value = className;
    classOption.textContent = className;
    classSelect.appendChild(classOption);
  });
}
makeClassOptions();

/* ==================================================
   7단계. 선택과목 자동완성 목록 만들기
   --------------------------------------------------
   학생은 "선택1", "선택2"를 고르는 것이 아닙니다.
   실제 과목명인 "화학", "물리학", "사회와 문화" 같은 값을 골라야 합니다.

   따라서 선택과목 목록은 classroomName이 아니라
   content 값을 기준으로 만들어야 합니다.

   처리 순서:
   --------------------------------------------------
   1. 빈 배열 subjects를 만든다.
   2. timetableData를 반복한다.
   3. classroomName이 "선택"으로 시작하는 데이터만 찾는다.
   4. content 값을 가져온다.
   5. content에 "[보강]"이 있으면 제거한다.
   6. 공휴일, 방학 같은 값은 제외한다.
   7. 중복되지 않는 과목명만 배열에 추가한다.
   8. 과목명을 가나다순으로 정렬한다.
   9. subjectOptions 안에 option 태그를 추가한다.

   필요한 함수:
   --------------------------------------------------
   getSubjectName()
   isRealSubject()

   위 함수들은 아래쪽에 틀을 만들어두었습니다.
================================================== */

function makeSubjectOptions() {
  // TODO. 선택과목 이름을 담을 빈 배열을 만드세요.
  let subjects = [];
  // TODO. timetableData를 반복하세요.
  timetableData.forEach((tableInfo) => {
    // TODO. classroomName이 "선택"으로 시작하는 데이터만 처리하세요.
    if (
      tableInfo.classroomName.startsWith("선택") &&
      isRealSubject(getSubjectName(tableInfo.content))
    ) {
      // TODO. getSubjectName 함수를 이용해서 과목명을 정리하세요.
      const subjectName = getSubjectName(tableInfo.content);
      // TODO. isRealSubject 함수를 이용해서 실제 과목인지 확인하세요.
      if (isRealSubject(subjectName) && !subjects.includes(subjectName)) {
        // TODO. 중복되지 않는 과목만 배열에 추가하세요.
        subjects.push(subjectName);
      }
    }
  });
  // TODO. 과목명을 가나다순으로 정렬하세요.
  subjects.sort();
  // TODO. subjectOptions 안에 option 태그를 추가하세요.
  subjects.forEach((subject) => {
    const subjectOption = document.createElement("option");
    subjectOption.value = subject;
    subjectOption.textContent = subject;
    subjectOptions.appendChild(subjectOption);
  });
}
makeSubjectOptions();

/* ==================================================
   8단계. 날짜 기본값 넣기
   --------------------------------------------------
   페이지가 처음 열렸을 때 날짜 input에 기본 날짜를 넣습니다.

   기본 날짜는 시간표 데이터의 첫 번째 날짜를 사용합니다.

   처리 순서:
   --------------------------------------------------
   1. 오늘 날짜를 dateInput.value에 넣는다.

   예:
   --------------------------------------------------
   오늘 날짜가 "2026-03-02"라면
   dateInput에는 "2026-03-02"가 들어가야 합니다.

   주의:
   --------------------------------------------------
   input type="date"는 반드시 YYYY-MM-DD 형식을 사용해야 합니다.
================================================== */

function setDefaultDate() {
  // TODO. timetableData의 첫 번째 날짜를 dateInput.value에 넣으세요.
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localDate = new Date(now.getTime() - offset)
    .toISOString()
    .substring(0, 10);
  dateInput.value = localDate;
}
setDefaultDate();

/* ==================================================
   9단계. 주차 이동 함수 만들기 x
   --------------------------------------------------
   이전 주 / 다음 주 버튼을 눌렀을 때 사용할 함수입니다.

   매개변수:
   --------------------------------------------------
   dayCount

   dayCount 예시:
   --------------------------------------------------
   -7  → 이전 주
    7  → 다음 주

   처리 순서:
   --------------------------------------------------
   1. 현재 dateInput.value를 가져온다.
   2. Date 객체로 변환한다.
   3. 날짜에 dayCount를 더한다.
   4. 변경된 날짜를 YYYY-MM-DD 형식으로 바꾼다.
   5. dateInput.value에 다시 넣는다.
   6. localStorage에 저장한다.
   7. 시간표를 다시 그린다.

   필요한 함수:
   --------------------------------------------------
   formatDateForInput()
================================================== */

function moveWeek(dayCount) {
  // TODO. 현재 dateInput.value를 Date 객체로 변환하세요.
  // TODO. 날짜에 dayCount를 더하세요.
  // TODO. 변경된 날짜를 YYYY-MM-DD 문자열로 바꾸세요.
  // TODO. dateInput.value에 변경된 날짜를 넣으세요.
  // TODO. 변경된 값을 localStorage에 저장하세요.
  // TODO. 시간표를 다시 그리세요.
}

/* ==================================================
   10단계. 선택한 날짜가 포함된 주의 월요일 구하기
   --------------------------------------------------
   사용자가 어떤 날짜를 선택해도
   시간표는 그 주의 월요일부터 금요일까지 보여줘야 합니다.

   예시:
   --------------------------------------------------
   사용자가 2026-03-04 수요일을 선택했다면
   화면은 2026-03-02 월요일부터 보여줘야 합니다.

   매개변수:
   --------------------------------------------------
   dateText
   예: "2026-03-04"

   반환값:
   --------------------------------------------------
   월요일에 해당하는 Date 객체

   처리 순서:
   --------------------------------------------------
   1. dateText를 Date 객체로 변환한다.
   2. getDay()로 요일 숫자를 구한다.
   3. 월요일까지 며칠 이동해야 하는지 계산한다.
   4. 계산된 만큼 날짜를 이동한다.
   5. 월요일 Date 객체를 반환한다.

   getDay() 결과:
   --------------------------------------------------
   일요일 0
   월요일 1
   화요일 2
   수요일 3
   목요일 4
   금요일 5
   토요일 6

   주의:
   --------------------------------------------------
   일요일은 이전 월요일로 이동하는 것이 자연스럽습니다.
================================================== */

function getMonday(dateText) {
  // TODO. dateText를 Date 객체로 변환하세요.
  date = new Date(dateText);
  // TODO. getDay()로 요일 숫자를 구하세요.
  const day = date.getDay();
  // TODO. 월요일까지 이동해야 할 날짜 차이를 계산하세요.
  let monday = 0;
  if (day === 0) {
    monday = 1;
  } else {
    // TODO. 날짜를 이동하세요.
    monday = 1 - day;
  }
  // TODO. 월요일 Date 객체를 반환하세요.
  date.setDate(date.getDate() + monday);
  return date;
}

/* ==================================================
   11단계. 월요일부터 금요일까지 날짜 배열 만들기
   --------------------------------------------------
   getMonday 함수로 구한 월요일을 기준으로
   월, 화, 수, 목, 금 날짜 배열을 만듭니다.

   매개변수:
   --------------------------------------------------
   monday
   월요일 Date 객체

   반환값:
   --------------------------------------------------
   [
     "2026-03-02",
     "2026-03-03",
     "2026-03-04",
     "2026-03-05",
     "2026-03-06"
   ]

   처리 순서:
   --------------------------------------------------
   1. 빈 배열 weekDates를 만든다.
   2. 0부터 4까지 반복한다.
   3. monday를 복사한 새 Date 객체를 만든다.
   4. 복사한 날짜에 i일을 더한다.
   5. YYYY-MM-DD 문자열로 바꾼다.
   6. 배열에 추가한다.
   7. 완성된 배열을 반환한다.

   주의:
   --------------------------------------------------
   monday 자체를 직접 수정하면 날짜 계산이 꼬일 수 있습니다.
   반복문 안에서는 새 Date 객체를 만들어 사용하는 것이 안전합니다.
================================================== */

function makeWeekDates(monday) {
  // TODO. 월~금 날짜를 담을 빈 배열을 만드세요.
  let weekDates = [];
  // TODO. 5번 반복하세요.
  for (let i = 0; i <= 4; i++) {
    // TODO. monday를 복사한 Date 객체를 만드세요.
    const newDate = new Date(monday);
    // TODO. 복사한 날짜에 i일을 더하세요.
    newDate.setDate(newDate.getDate() + i);
    // TODO. YYYY-MM-DD 형식으로 바꿔 배열에 넣으세요.
    const date = newDate.toISOString().split("T")[0];
    weekDates.push(date);
  }
  // TODO. 완성된 배열을 반환하세요.
  return weekDates;
}

/* ==================================================
   12단계. Date 객체를 YYYY-MM-DD 문자열로 바꾸기 x
   --------------------------------------------------
   input type="date"에 값을 넣으려면
   반드시 YYYY-MM-DD 형식이어야 합니다.

   매개변수:
   --------------------------------------------------
   date
   Date 객체

   반환값 예시:
   --------------------------------------------------
   "2026-03-02"

   처리 순서:
   --------------------------------------------------
   1. 연도를 구한다.
   2. 월을 구한다.
      - getMonth()는 0부터 시작하므로 1을 더해야 한다.
   3. 일을 구한다.
   4. 월과 일이 한 자리면 앞에 0을 붙인다.
   5. YYYY-MM-DD 형식의 문자열을 반환한다.

   필요한 문법:
   --------------------------------------------------
   String(값)
   padStart(2, "0")
================================================== */

function formatDateForInput(date) {
  // TODO. 연도를 구하세요.
  // TODO. 월을 구하세요. getMonth()는 0부터 시작합니다.
  // TODO. 일을 구하세요.
  // TODO. 월과 일을 두 자리 문자열로 바꾸세요.
  // TODO. YYYY-MM-DD 형식으로 반환하세요.
}

/* ==================================================
   13단계. 날짜를 화면 표시용으로 짧게 바꾸기
   --------------------------------------------------
   테이블 헤더에는 "2026-03-02"보다 "3/2"가 보기 좋습니다.

   매개변수:
   --------------------------------------------------
   dateText
   예: "2026-03-02"

   반환값 예시:
   --------------------------------------------------
   "3/2"

   처리 순서:
   --------------------------------------------------
   1. dateText를 Date 객체로 변환한다.
   2. 월을 구한다.
   3. 일을 구한다.
   4. "월/일" 형태의 문자열을 반환한다.
================================================== */

function formatShortDate(dateText) {
  // TODO. dateText를 Date 객체로 변환하세요.
  const newDate = new Date(dateText);
  // TODO. 월과 일을 구하세요.
  const month = newDate.getMonth() + 1;
  const date = newDate.getDate();
  // TODO. "월/일" 형태로 반환하세요.
  return `${month}/${date}`;
}
formatShortDate("2026-03-02");

/* ==================================================
   14단계. 시간표 전체 그리기
   --------------------------------------------------
   이 프로젝트의 핵심 함수입니다.

   반, 날짜, 선택과목이 바뀔 때마다
   이 함수를 다시 실행하면 화면이 갱신되어야 합니다.

   처리 순서:
   --------------------------------------------------
   1. 현재 선택된 반을 가져온다.
   2. 현재 선택된 날짜를 가져온다.
   3. 현재 날짜가 포함된 주의 월요일을 구한다.
   4. 월요일부터 금요일까지 날짜 배열을 만든다.
   5. 페이지 제목을 변경한다.
   6. 주차 표시를 변경한다.
   7. 선택과목 안내 문구를 변경한다.
   8. 테이블 머리 부분을 그린다.
   9. 테이블 본문 부분을 그린다.

   필요한 함수:
   --------------------------------------------------
   getMonday()
   makeWeekDates()
   formatShortDate()
   makeSelectedSubjectText()
   renderTableHead()
   renderTableBody()
================================================== */

function renderTimetable() {
  // TODO. 현재 선택된 반 값을 가져오세요.
  classSelect.addEventListener("change", (event) => {
    // TODO. pageTitle에 "2학년 1반 시간표" 같은 제목을 넣으세요.
    choiceClass = event.target.value;
    pageTitle.textContent = `2학년 ${choiceClass}반 시간표`;
  });

  // TODO. 현재 선택된 날짜 값을 가져오세요.
  dateInput.addEventListener("change", (event) => {
    // TODO. 선택 날짜가 포함된 주의 월요일을 구하세요.
    const mondayDate = getMonday(event.target.value);
    // TODO. 월요일부터 금요일까지 날짜 배열을 만드세요.
    const weekDates = makeWeekDates(mondayDate);
    // TODO. weekLabel에 "3/2 ~ 3/6" 같은 주차 정보를 넣으세요. x
  });

  // TODO. selectedInfo에 현재 선택과목 안내 문구를 넣으세요.
  let subject = [];
  subjectInputs.forEach((subjectInput) => {
    subjectInput.addEventListener("change", (event) => {
      subject.push(event.target.value);
      selectedInfo.textContent = subject;
    });
  });
  // TODO. renderTableHead 함수를 실행하세요.

  // TODO. renderTableBody 함수를 실행하세요.
}
renderTimetable();

/* ==================================================
   15단계. 테이블 머리 부분 그리기
   --------------------------------------------------
   thead에는 교시, 월, 화, 수, 목, 금을 표시합니다.

   매개변수:
   --------------------------------------------------
   weekDates
   월요일부터 금요일까지의 날짜 배열

   예시:
   --------------------------------------------------
   [
     "2026-03-02",
     "2026-03-03",
     "2026-03-04",
     "2026-03-05",
     "2026-03-06"
   ]

   만들어야 하는 화면:
   --------------------------------------------------
   교시 | 월 3/2 | 화 3/3 | 수 3/4 | 목 3/5 | 금 3/6

   처리 순서:
   --------------------------------------------------
   1. html 문자열을 준비한다.
   2. 첫 번째 칸에는 "교시"를 넣는다.
   3. weekDates를 반복한다.
   4. dayNames 배열에서 요일을 가져온다.
   5. formatShortDate로 날짜를 짧게 만든다.
   6. th 태그를 만든다.
   7. 완성된 html을 tableHead.innerHTML에 넣는다.
================================================== */

function renderTableHead(weekDates) {
  // TODO. tableHead에 넣을 html 문자열을 만드세요.
  let tableHeadHtml = "<tr>";
  // TODO. 첫 번째 th에는 "교시"를 넣으세요.
  tableHeadHtml += "<th>교시</th>";
  // TODO. weekDates를 반복하세요.
  weekDates.forEach((weekDate, i) => {
    // TODO. 요일 이름과 날짜를 th로 만드세요.
    const day = dayNames[i];
    const shorDate = formatShortDate(weekDate);
    tableHeadHtml += `<th>${day} ${shorDate}</th>`;
  });
  tableHeadHtml += "</tr>";
  // TODO. 완성된 html을 tableHead.innerHTML에 넣으세요.
  tableHead.innerHTML = tableHeadHtml;
}

/* ==================================================
   16단계. 테이블 본문 그리기
   --------------------------------------------------
   tbody에는 실제 시간표 칸이 들어갑니다.

   구조:
   --------------------------------------------------
   - 행: 교시
   - 열: 요일

   즉,
   1교시 행 안에 월~금 칸이 있고
   2교시 행 안에 월~금 칸이 있는 구조입니다.

   매개변수:
   --------------------------------------------------
   weekDates
   월요일부터 금요일까지의 날짜 배열

   처리 순서:
   --------------------------------------------------
   1. html 문자열을 준비한다.
   2. periods 배열을 반복한다.
   3. 각 교시마다 tr을 만든다.
   4. 첫 번째 칸에는 "1교시", "2교시" 등을 넣는다.
   5. weekDates를 반복한다.
   6. 현재 날짜와 현재 교시에 맞는 수업을 찾는다.
   7. 찾은 수업을 카드 HTML로 바꾼다.
   8. td 안에 넣는다.
   9. 완성된 html을 tableBody.innerHTML에 넣는다.

   필요한 함수:
   --------------------------------------------------
   findLessons()
   makeLessonCards()
================================================== */

function renderTableBody(weekDates) {
  // TODO. tableBody에 넣을 html 문자열을 만드세요.
  // TODO. periods 배열을 반복하세요.
  // TODO. 각 교시마다 tr을 만드세요.
  // TODO. 첫 번째 칸에는 현재 교시를 표시하세요.
  // TODO. weekDates를 반복하면서 날짜별 칸을 만드세요.
  // TODO. findLessons 함수로 현재 날짜/교시의 수업을 찾으세요.
  // TODO. makeLessonCards 함수로 수업 카드 HTML을 만드세요.
  // TODO. 완성된 html을 tableBody.innerHTML에 넣으세요.
}

/* ==================================================
   17단계. 현재 칸에 들어갈 수업 찾기
   --------------------------------------------------
   시간표 한 칸은 날짜와 교시로 결정됩니다.

   예:
   --------------------------------------------------
   2026-03-02 월요일 1교시
   2026-03-03 화요일 2교시

   이 칸에 들어가야 하는 수업:
   --------------------------------------------------
   1. 내가 선택한 반의 수업
   2. 내가 선택한 선택과목 수업

   매개변수:
   --------------------------------------------------
   date
   현재 칸의 날짜

   period
   현재 칸의 교시

   반환값:
   --------------------------------------------------
   현재 칸에 표시할 수업 배열

   처리 순서:
   --------------------------------------------------
   1. 현재 선택한 반 값을 가져온다.
   2. 현재 입력한 선택과목 배열을 가져온다.
   3. timetableData를 filter로 걸러낸다.
   4. 날짜가 같은지 확인한다.
   5. 교시가 같은지 확인한다.
   6. 일반 반 수업인지 확인한다.
   7. 선택과목 수업인지 확인한다.
   8. 조건에 맞는 수업만 반환한다.

   일반 반 수업 조건:
   --------------------------------------------------
   item.classroomName이 현재 선택한 반과 같으면 된다.

   선택과목 수업 조건:
   --------------------------------------------------
   1. item.classroomName이 "선택"으로 시작한다.
   2. item.content에서 실제 과목명을 뽑는다.
   3. 그 과목명이 내가 입력한 선택과목 배열 안에 있다.

   필요한 함수:
   --------------------------------------------------
   getSelectedSubjects()
   getSubjectName()
================================================== */

function findLessons(date, period) {
  // TODO. 현재 선택한 반 값을 가져오세요.
  // TODO. 현재 입력한 선택과목 배열을 가져오세요.
  // TODO. timetableData를 filter로 반복하세요.
  // TODO. 날짜가 같은지 확인하세요.
  // TODO. 교시가 같은지 확인하세요.
  // TODO. 일반 반 수업인지 확인하세요.
  // TODO. 선택과목 수업인지 확인하세요.
  // TODO. 조건에 맞는 수업만 반환하세요.
}

/* ==================================================
   18단계. 수업 카드 HTML 만들기
   --------------------------------------------------
   findLessons에서 찾은 수업 배열을 받아서
   화면에 보여줄 HTML 문자열로 만듭니다.

   매개변수:
   --------------------------------------------------
   lessons
   현재 칸에 들어갈 수업 배열

   처리 순서:
   --------------------------------------------------
   1. lessons가 비어 있는지 확인한다.
   2. 비어 있으면 "-"를 표시할 HTML을 반환한다.
   3. 비어 있지 않으면 lessons를 반복한다.
   4. 각 수업의 카드 종류를 구한다.
   5. 수업내용을 표시한다.
   6. 일반 반이면 "1반"처럼 표시한다.
   7. 선택과목이면 "선택1"처럼 표시한다.
   8. 완성된 카드 HTML 문자열을 반환한다.

   카드에 들어갈 내용:
   --------------------------------------------------
   - 수업내용
   - 반 또는 선택과목 강의실명

   필요한 함수:
   --------------------------------------------------
   getLessonType()
================================================== */

function makeLessonCards(lessons) {
  // TODO. lessons 배열이 비어 있으면 "-" 표시용 HTML을 반환하세요.
  // TODO. lessons를 반복하면서 카드 HTML을 만드세요.
  // TODO. getLessonType 함수로 카드 종류 class를 구하세요.
  // TODO. 수업내용과 반/강의실명을 카드에 넣으세요.
  // TODO. 완성된 HTML 문자열을 반환하세요.
}

/* ==================================================
   19단계. 선택과목 input 값 가져오기
   --------------------------------------------------
   선택과목 input 3개에 입력된 값을 배열로 만듭니다.

   반환값 예시:
   --------------------------------------------------
   ["화학", "물리학"]

   처리 순서:
   --------------------------------------------------
   1. 빈 배열을 만든다.
   2. subjectInputs를 반복한다.
   3. 각 input의 value를 가져온다.
   4. 앞뒤 공백을 제거한다.
   5. 빈 문자열이면 제외한다.
   6. 이미 배열에 들어있는 과목이면 제외한다.
   7. 완성된 배열을 반환한다.

   필요한 문법:
   --------------------------------------------------
   input.value
   trim()
   includes()
================================================== */

function getSelectedSubjects() {
  // TODO. 선택과목을 담을 빈 배열을 만드세요.
  let selectedSubjects = [];
  // TODO. subjectInputs를 반복하세요.
  subjectInputs.forEach((subjectInput) => {
    // TODO. 각 input의 value를 가져오고 trim으로 공백을 제거하세요.
    const subject = subjectInput.value.trim();
    // TODO. 중복된 과목은 제외하세요.
    // TODO. 빈 문자열은 제외하세요.
    if (!selectedSubjects.includes(subject) && !subject == "") {
      selectedSubjects.push(subject);
    }
  });
  // TODO. 완성된 배열을 반환하세요.
  console.log(selectedSubjects);
  return selectedSubjects;
}

/* ==================================================
   20단계. 선택과목 안내 문구 만들기
   --------------------------------------------------
   시간표 위쪽에 현재 입력한 선택과목을 보여줍니다.

   선택과목이 없는 경우:
   --------------------------------------------------
   선택과목을 입력하면 일반 반 시간표와 함께 표시됩니다.

   선택과목이 있는 경우:
   --------------------------------------------------
   선택과목: 화학, 물리학, 사회와 문화

   처리 순서:
   --------------------------------------------------
   1. getSelectedSubjects로 선택과목 배열을 가져온다.
   2. 배열이 비어 있는지 확인한다.
   3. 비어 있으면 기본 안내 문구를 반환한다.
   4. 비어 있지 않으면 과목명을 쉼표로 이어서 반환한다.

   필요한 문법:
   --------------------------------------------------
   배열.length
   배열.join(", ")
================================================== */

function makeSelectedSubjectText() {
  // TODO. 선택과목 배열을 가져오세요.
  // TODO. 선택과목이 없으면 기본 안내 문구를 반환하세요.
  // TODO. 선택과목이 있으면 "선택과목: ..." 형태의 문구를 반환하세요.
}

/* ==================================================
   21단계. content에서 실제 과목명만 뽑기
   --------------------------------------------------
   데이터의 content에는 "[보강]" 같은 표시가 붙을 수 있습니다.

   예:
   --------------------------------------------------
   "[보강]화학" → "화학"
   "[보강]영어 I" → "영어 I"

   매개변수:
   --------------------------------------------------
   content
   수업내용

   반환값:
   --------------------------------------------------
   정리된 과목명

   처리 순서:
   --------------------------------------------------
   1. content를 문자열로 변환한다.
   2. "[보강]" 문자를 제거한다.
   3. 앞뒤 공백을 제거한다.
   4. 정리된 문자열을 반환한다.

   필요한 문법:
   --------------------------------------------------
   String()
   replace()
   trim()
================================================== */

function getSubjectName(content) {
  // TODO. content를 문자열로 변환하세요.
  content = String(content);
  // TODO. "[보강]" 문자를 제거하세요.
  content = content.replace("[보강]", "");
  // TODO. 앞뒤 공백을 제거하세요.
  content = content.trim();
  // TODO. 정리된 과목명을 반환하세요.
  return content;
}

/* ==================================================
   22단계. 실제 과목인지 확인하기
   --------------------------------------------------
   선택과목 자동완성 목록에는 실제 과목만 들어가야 합니다.

   그런데 데이터에는 아래처럼 과목이 아닌 내용도 들어갈 수 있습니다.

   제외할 값 예시:
   --------------------------------------------------
   대체공휴일
   어린이날
   재량휴업일
   지방선거일
   노동절
   현충일
   제헌절
   여름방학
   토요휴업일
   자기주도학습

   매개변수:
   --------------------------------------------------
   subjectName
   과목명처럼 보이는 문자열

   반환값:
   --------------------------------------------------
   실제 과목이면 true
   과목이 아니면 false

   처리 순서:
   --------------------------------------------------
   1. 제외할 값 배열을 만든다.
   2. subjectName이 제외 배열에 들어있는지 확인한다.
   3. 들어있으면 false를 반환한다.
   4. 들어있지 않으면 true를 반환한다.

   필요한 문법:
   --------------------------------------------------
   배열.includes()
================================================== */

function isRealSubject(subjectName) {
  // TODO. 과목이 아닌 값들을 배열로 만드세요.
  notSubject = [
    "대체공휴일",
    "어린이날",
    "재량휴업일",
    "지방선거일",
    "노동절",
    "현충일",
    "제헌절",
    "여름방학",
    "토요휴업일",
    "자기주도학습",
  ];
  // TODO. subjectName이 제외 배열에 포함되어 있는지 확인하세요.
  if (notSubject.includes(subjectName)) {
    return false;
  }
  return true;
  // TODO. 과목이면 true, 과목이 아니면 false를 반환하세요.
}

/* ==================================================
   23단계. 수업 카드 종류 판단하기
   --------------------------------------------------
   수업 카드에 어떤 CSS class를 붙일지 결정합니다.

   카드 종류:
   --------------------------------------------------
   1. normal
      일반 반 수업

   2. elective
      선택과목 수업

   3. rest
      공휴일, 방학, 재량휴업일 등

   매개변수:
   --------------------------------------------------
   lesson
   수업 데이터 하나

   반환값:
   --------------------------------------------------
   "normal"
   "elective"
   "rest"

   처리 순서:
   --------------------------------------------------
   1. lesson.classroomName을 확인한다.
   2. classroomName이 "선택"으로 시작하면 "elective"를 반환한다.
   3. lesson.content에서 과목명을 정리한다.
   4. 실제 과목이 아니면 "rest"를 반환한다.
   5. 그 외에는 "normal"을 반환한다.

   필요한 함수:
   --------------------------------------------------
   getSubjectName()
   isRealSubject()
================================================== */

function getLessonType(lesson) {
  // TODO. classroomName을 가져오세요.
  // TODO. classroomName이 "선택"으로 시작하면 "elective"를 반환하세요.
  // TODO. content에서 과목명을 정리하세요.
  // TODO. 실제 과목이 아니면 "rest"를 반환하세요.
  // TODO. 그 외에는 "normal"을 반환하세요.
}

/* ==================================================
   24단계. 반, 날짜, 선택과목 저장하기
   --------------------------------------------------
   사용자가 입력한 값을 localStorage에 저장합니다.

   저장할 값:
   --------------------------------------------------
   1. 선택한 반
   2. 선택한 날짜
   3. 선택과목 1
   4. 선택과목 2
   5. 선택과목 3

   저장 시점:
   --------------------------------------------------
   - 반을 바꿨을 때
   - 날짜를 바꿨을 때
   - 선택과목을 입력했을 때
   - 이전 주 / 다음 주 버튼을 눌렀을 때
   - 첫 주 버튼을 눌렀을 때

   localStorage 저장 문법:
   --------------------------------------------------
   localStorage.setItem(key, value)
================================================== */

function saveControls() {
  // TODO. 선택한 반을 localStorage에 저장하세요.
  // TODO. 선택한 날짜를 localStorage에 저장하세요.
  // TODO. 선택과목 1 값을 localStorage에 저장하세요.
  // TODO. 선택과목 2 값을 localStorage에 저장하세요.
  // TODO. 선택과목 3 값을 localStorage에 저장하세요.
}

/* ==================================================
   25단계. 저장된 반, 날짜, 선택과목 불러오기
   --------------------------------------------------
   새로고침했을 때 이전에 입력한 값이 유지되게 합니다.

   불러올 값:
   --------------------------------------------------
   1. 저장된 반
   2. 저장된 날짜
   3. 저장된 선택과목 1
   4. 저장된 선택과목 2
   5. 저장된 선택과목 3

   처리 순서:
   --------------------------------------------------
   1. localStorage에서 저장된 값을 가져온다.
   2. 저장된 반이 있으면 classSelect.value에 넣는다.
   3. 저장된 날짜가 있으면 dateInput.value에 넣는다.
   4. 저장된 선택과목이 있으면 각각 input.value에 넣는다.

   주의:
   --------------------------------------------------
   저장된 반이 현재 select option 안에 실제로 있는지 확인하는 것이 좋습니다.

   localStorage 불러오기 문법:
   --------------------------------------------------
   localStorage.getItem(key)
================================================== */

function loadSavedControls() {
  // TODO. localStorage에서 저장된 반을 가져오세요.
  // TODO. localStorage에서 저장된 날짜를 가져오세요.
  // TODO. localStorage에서 저장된 선택과목 1을 가져오세요.
  // TODO. localStorage에서 저장된 선택과목 2를 가져오세요.
  // TODO. localStorage에서 저장된 선택과목 3을 가져오세요.
  // TODO. 저장된 반이 있고 실제 option에 존재하면 classSelect.value에 넣으세요.
  // TODO. 저장된 날짜가 있으면 dateInput.value에 넣으세요.
  // TODO. 저장된 선택과목 값이 있으면 각 input.value에 넣으세요.
}

/* ==================================================
   26단계. 저장된 반이 실제 option에 있는지 확인하기
   --------------------------------------------------
   localStorage에 저장된 반 값이 현재 select 안에 없을 수도 있습니다.

   예:
   --------------------------------------------------
   예전에는 10반이 있었는데
   현재 데이터에는 10반이 없을 수 있습니다.

   매개변수:
   --------------------------------------------------
   className
   저장된 반 이름

   반환값:
   --------------------------------------------------
   있으면 true
   없으면 false

   처리 순서:
   --------------------------------------------------
   1. classSelect.options를 배열로 바꾼다.
   2. option들의 value를 확인한다.
   3. className과 같은 value가 있는지 확인한다.
   4. 있으면 true
   5. 없으면 false

   필요한 문법:
   --------------------------------------------------
   Array.from()
   배열.some()
================================================== */

function hasClassOption(className) {
  // TODO. classSelect.options를 배열로 바꾸세요.
  // TODO. option 중에서 value가 className과 같은 것이 있는지 확인하세요.
  // TODO. 있으면 true, 없으면 false를 반환하세요.
}

/* ==================================================
   27단계. 오늘의 메모 저장하기
   --------------------------------------------------
   메모는 시간표 데이터와 별개로
   사용자가 직접 입력하는 개인 데이터입니다.

   저장 시점:
   --------------------------------------------------
   사용자가 memoInput에 내용을 입력할 때마다 저장합니다.

   처리 순서:
   --------------------------------------------------
   1. memoInput.value를 가져온다.
   2. localStorage에 저장한다.
   3. memoStatus에 "저장됨" 같은 문구를 표시한다.

   localStorage 저장 문법:
   --------------------------------------------------
   localStorage.setItem(key, value)
================================================== */

function saveMemo() {
  // TODO. memoInput.value를 localStorage에 저장하세요.
  // TODO. memoStatus에 저장 상태 문구를 표시하세요.
}

/* ==================================================
   28단계. 오늘의 메모 불러오기
   --------------------------------------------------
   새로고침했을 때 메모가 사라지지 않도록
   localStorage에서 메모를 불러옵니다.

   처리 순서:
   --------------------------------------------------
   1. localStorage에서 저장된 메모를 가져온다.
   2. 저장된 메모가 있는지 확인한다.
   3. 있으면 memoInput.value에 넣는다.
   4. memoStatus에 "불러옴" 같은 문구를 표시한다.

   localStorage 불러오기 문법:
   --------------------------------------------------
   localStorage.getItem(key)
================================================== */

function loadSavedMemo() {
  // TODO. localStorage에서 저장된 메모를 가져오세요.
  // TODO. 저장된 메모가 있으면 memoInput.value에 넣으세요.
  // TODO. memoStatus에 불러온 상태 문구를 표시하세요.
}

/* ==================================================
   29단계. 마지막 실행
   --------------------------------------------------
   위에서 만든 init 함수를 실행해야
   페이지가 처음 열렸을 때 기능이 시작됩니다.

   주의:
   --------------------------------------------------
   init 함수는 가장 마지막에 한 번만 실행하면 됩니다.
================================================== */

// TODO. init 함수를 실행하세요.
