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

// 폭죽 애니메이션 생성 함수
function showFireworks(card) {
  // 좌우 상단에 폭죽 컨테이너 생성
  ['left', 'right'].forEach(side => {
    const firework = document.createElement('div');
    firework.className = 'firework ' + side;
    // 더 많은 색상과 파티클 개수, 불꽃놀이 느낌
    const colors = [
      '#fbbf24','#f87171','#60a5fa','#34d399','#f472b6','#facc15','#a78bfa',
      '#f59e42','#e11d48','#6366f1','#06b6d4','#84cc16','#f472b6','#f43f5e',
      '#fcd34d','#818cf8','#fca5a5','#f9fafb','#fef08a',
      '#f472b6','#f43f5e','#fcd34d','#818cf8','#fca5a5','#f9fafb','#fef08a'
    ];
    const particleCount = 28;
    for (let i = 0; i < particleCount; i++) {
      const dot = document.createElement('div');
      dot.className = 'firework-dot';
      // 색상 랜덤
      const color = colors[Math.floor(Math.random() * colors.length)];
      dot.style.setProperty('--dot-color', color);
      dot.style.background = `radial-gradient(circle at 30% 30%, #fff 0%, ${color} 80%)`;
      // 각 파티클의 방향(각도) 지정
      const angle = (Math.PI * 2 / particleCount) * i + Math.random() * 0.2;
      const radius = 60 + Math.random() * 30; // 반경 랜덤
      const tx = Math.cos(angle) * radius + 'px';
      const ty = Math.sin(angle) * radius + 'px';
      dot.style.setProperty('--tx', tx);
      dot.style.setProperty('--ty', ty);
      // 크기, 투명도, 애니메이션 속도 랜덤
      const size = 14 + Math.random() * 18;
      dot.style.width = size + 'px';
      dot.style.height = size + 'px';
      dot.style.opacity = 0.7 + Math.random() * 0.3;
      dot.style.animationDuration = (1.3 + Math.random() * 0.7) + 's';
      firework.appendChild(dot);
    }
    card.appendChild(firework);
    // 애니메이션 후 폭죽 제거
    setTimeout(() => firework.remove(), 2000);
  });
}

// 폭죽 애니메이션 생성 함수 (반복)
function startFireworksLoop(card) {
  // 이미 루프가 있으면 중복 실행 방지
  if (card.fireworkInterval) return;
  // 최초 1회 즉시 실행
  showFireworks(card);
  // 1.2초마다 반복 실행
  card.fireworkInterval = setInterval(() => {
    showFireworks(card);
  }, 1200);
}

// 폭죽 애니메이션 중지 함수
function stopFireworksLoop(card) {
  if (card.fireworkInterval) {
    clearInterval(card.fireworkInterval);
    card.fireworkInterval = null;
  }
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
    cardList[shuffledIdx].classList.remove('show','flipped','selected');
    cardList[shuffledIdx].style.pointerEvents = 'auto';
    cardList[shuffledIdx].style.transition = '';
    cardList[shuffledIdx].style.transform = '';
    cardList[shuffledIdx].style.opacity = '0';
    // 카드 앞면 이미지 변경
    const frontImg = cardList[shuffledIdx].querySelector('.card-front');
    frontImg.src = selectedImages[i];
    stopFireworksLoop(cardList[shuffledIdx]);
    // 기존 물풍선 제거
    const oldBubble = cardList[shuffledIdx].querySelector('.speech-bubble');
    if (oldBubble) oldBubble.remove();
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
    // 모든 카드 비활성화 및 선택 해제
    cards.forEach(c => {
      c.classList.remove('flipped','selected');
      c.style.pointerEvents = 'none';
      stopFireworksLoop(c); // 기존 폭죽 중지
      // 기존 물풍선 제거
      const oldBubble = c.querySelector('.speech-bubble');
      if (oldBubble) oldBubble.remove();
    });
    // 선택된 카드만 중앙으로 이동하며 커지고 앞면 보이기
    card.classList.add('flipped','selected');
    card.style.pointerEvents = 'auto';
    cardFlipped = true;
    countdownEl.textContent = '3';
    askNameEl.style.display = 'none';
    preQuestionEl.style.display = 'none';
    if (timer) clearInterval(timer);
    // 폭죽 애니메이션 반복 실행
    startFireworksLoop(card);
    // 물풍선 추가
    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble';
    bubble.textContent = '내 이름을 맞춰줘~';
    card.appendChild(bubble);
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