// 사용할 강아지 사진 파일명 배열 (dog1~dog8.jpg)
const allDogImages = [
  'dog1.jpg', 'dog2.jpg', 'dog3.jpg', 'dog4.jpg',
  'dog5.jpg', 'dog6.jpg', 'dog7.jpg', 'dog8.jpg'
];

// 카드 DOM 요소들을 모두 가져옴
const cards = document.querySelectorAll('.card');
// 카운트다운 숫자를 표시할 요소
const countdownEl = document.getElementById('countdown');
// 이름 입력 안내 문구 요소
const askNameEl = document.getElementById('ask-name');
// 3초 카운트다운 전 안내 문구 요소
const preQuestionEl = document.getElementById('pre-question');

// 카운트다운 타이머 변수(중복 방지용)
let timer = null;
// 카드가 이미 한 번 클릭되었는지 여부를 저장하는 변수
let cardFlipped = false;

// 카드 섞기 함수 (Fisher-Yates)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// 카드 중앙 집합 및 섞기 애니메이션 함수
function scrambleCards(cards) {
  // 중앙에 모이게 transform
  cards.forEach(card => {
    card.style.transition = 'transform 0.3s, opacity 0.3s';
    card.style.transform = 'translate(0, 0) scale(0.7)';
    card.style.opacity = '1';
  });
  // 1초간 랜덤하게 위치 이동 반복
  let scrambleCount = 0;
  const scrambleInterval = setInterval(() => {
    cards.forEach(card => {
      const randX = (Math.random() - 0.5) * 60;
      const randY = (Math.random() - 0.5) * 60;
      card.style.transform = `translate(${randX}px, ${randY}px) scale(0.7)`;
    });
    scrambleCount++;
    if (scrambleCount > 8) { // 약 1초간 반복
      clearInterval(scrambleInterval);
      // 원래 자리로 한 장씩 펼치기
      setTimeout(() => {
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.style.transition = 'opacity 0.5s, transform 0.5s';
            card.classList.add('show');
            card.style.transform = '';
          }, i * 180);
        });
      }, 100);
    }
  }, 100);
}

// 카드와 상태 초기화 및 애니메이션 실행 (가로 한 줄 배치)
function resetGame() {
  // 8장 중 5장 무작위 선택
  const dogImages = [...allDogImages];
  shuffle(dogImages);
  const selectedImages = dogImages.slice(0, 5);
  // 카드 DOM 재수집
  const allCards = document.querySelectorAll('.card');
  // 카드 인덱스 배열 생성 및 섞기
  const idxArr = [0,1,2,3,4];
  shuffle(idxArr);
  // 카드 DOM을 섞인 순서로 재배치 (가로 한 줄)
  const cardArea = document.querySelector('.card-area');
  const cardList = Array.from(allCards);
  idxArr.forEach((shuffledIdx, i) => {
    cardArea.appendChild(cardList[shuffledIdx]);
    cardList[shuffledIdx].classList.remove('show');
    cardList[shuffledIdx].classList.remove('flipped');
    cardList[shuffledIdx].style.transition = '';
    cardList[shuffledIdx].style.transform = '';
    cardList[shuffledIdx].style.opacity = '0';
    // 카드 앞면 이미지 변경
    const frontImg = cardList[shuffledIdx].querySelector('.card-front');
    frontImg.src = selectedImages[i];
  });
  // 카운트다운 3으로 초기화
  countdownEl.textContent = '3';
  // 안내문구 숨김
  askNameEl.style.display = 'none';
  // 3초 카운트다운 전 안내문구 보이기
  preQuestionEl.style.display = 'block';
  // 상태 변수 초기화
  cardFlipped = false;
  // 타이머 초기화
  if (timer) clearInterval(timer);
  // 카드 중앙 집합 및 섞기 애니메이션 실행
  setTimeout(() => {
    scrambleCards(cardList);
  }, 200);
}

// 게임 시작 시 초기화 및 애니메이션 실행
window.onload = () => {
  resetGame();
};

// 다시시작 버튼 이벤트
const restartBtn = document.getElementById('restart-btn');
if (restartBtn) {
  restartBtn.addEventListener('click', () => {
    resetGame();
  });
}

// 모든 카드에 클릭 이벤트 리스너 추가
cards.forEach((card, idx) => {
  card.addEventListener('click', () => {
    if (cardFlipped) return;
    if (card.classList.contains('flipped')) return;
    cards.forEach(c => c.classList.remove('flipped'));
    card.classList.add('flipped');
    cardFlipped = true;
    countdownEl.textContent = '3';
    askNameEl.style.display = 'none';
    // 3초 카운트다운 전 안내문구 숨기기
    preQuestionEl.style.display = 'none';
    if (timer) clearInterval(timer);
    startCountdown();
  });
});

// 3초 카운트다운 함수
function startCountdown() {
  let count = 3;
  timer = setInterval(() => {
    count--;
    countdownEl.textContent = count;
    if (count === 0) {
      clearInterval(timer);
      countdownEl.textContent = '0';
      askNameEl.style.display = 'block';
      // 3초 끝나면 안내문구도 사라지게
      preQuestionEl.style.display = 'none';
    }
  }, 1000);
}

// (선택) 카드 클릭 시 반응 추가하고 싶으면 아래 코드 사용
// cards.forEach(card => {
//   card.addEventListener('click', () => {
//     // 클릭 시 동작 추가 가능
//   });
// }); 