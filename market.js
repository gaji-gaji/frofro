const postList = document.getElementById('postList');
const postDetailsContainer = document.getElementById('postDetailsContainer');
const postDetails = document.getElementById('postDetails');
const chatContainer = document.getElementById('chatContainer');
const chatMessages = document.getElementById('chatMessages');
const chatMessage = document.getElementById('chatMessage');
const sendMessageBtn = document.getElementById('sendMessageBtn');

let posts = [];
let currentPost = null;

// 게시글 등록
document.getElementById('postButton').addEventListener('click', async () => {
  const title = document.getElementById('itemTitle').value;
  const price = document.getElementById('itemPrice').value;
  const description = document.getElementById('itemDescription').value;
  const imageInput = document.getElementById('itemImage');

  if (title && price && description && imageInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = async function (e) {
      try {
        const response = await fetch('/api/market', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, price, description, image: e.target.result }),
        });
        const newPost = await response.json();
        posts.push(newPost); // 서버에서 반환된 데이터 추가
        renderPostList();
      } catch (error) {
        console.error('게시글 등록 실패:', error);
      }
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    alert("모든 필드를 채워주세요.");
  }
});

// 게시글 목록 렌더링
async function loadPosts() {
  try {
    const response = await fetch('/api/market');
    posts = await response.json();
    renderPostList();
  } catch (error) {
    console.error('게시글 불러오기 실패:', error);
  }
}

function renderPostList() {
  postList.innerHTML = '';
  posts.forEach(post => postList.appendChild(createPostElement(post)));
}

function createPostElement(post) {
  const listItem = document.createElement('li');
  listItem.classList.add('post-item');
  listItem.innerHTML = `
    <img src="${post.image}" alt="상품 이미지">
    <div>
      <h3>${post.title}</h3>
      <p>${post.price}원</p>
    </div>
    <button onclick="viewPostDetails(${post.id})">상세보기</button>
  `;
  return listItem;
}

// 게시글 상세보기
function viewPostDetails(postId) {
  currentPost = posts.find(post => post.id === postId);
  if (currentPost) {
    postDetails.innerHTML = `
      <img src="${currentPost.image}" alt="상품 이미지">
      <h3>${currentPost.title}</h3>
      <p>가격: ${currentPost.price}원</p>
      <p>${currentPost.description}</p>
    `;
    postDetailsContainer.style.display = 'block';
    chatContainer.style.display = 'flex';
    chatMessages.innerHTML = ''; // 기존 채팅 초기화
  }
}

// 메시지 보내기
async function sendMessage() {
  const message = chatMessage.value.trim();
  if (message) {
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: currentPost.id, message }),
      });
      const newChat = await response.json();
      const messageElement = document.createElement('div');
      messageElement.textContent = newChat.message;
      chatMessages.appendChild(messageElement);
      chatMessage.value = '';
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    }
  }
}

// Enter 키와 버튼 클릭 이벤트 통합
sendMessageBtn.addEventListener('click', sendMessage);
chatMessage.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendMessage();
  }
});

// 초기 데이터 로드
loadPosts();
