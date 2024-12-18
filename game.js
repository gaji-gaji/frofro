document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    setupEventListeners();
});

// 게시물 목록 불러오기
async function loadPosts() {
    try {
        const response = await fetch('/api/posts');
        const posts = await response.json();

        const postList = document.getElementById('post-list-container');
        postList.innerHTML = ''; // 기존 게시물 초기화

        posts.forEach((post) => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <div>${post.content}</div>
            `;
            postList.appendChild(postElement);
        });
    } catch (error) {
        console.error('게시물 불러오기 실패:', error);
    }
}

// 게시물 작성 이벤트
function setupEventListeners() {
    const postForm = document.getElementById('postForm');
    postForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content }),
            });

            if (response.ok) {
                loadPosts(); // 게시물 목록 새로고침
                alert('게시물이 성공적으로 작성되었습니다!');
                postForm.reset(); // 입력 필드 초기화
            } else {
                console.error('게시물 작성 실패:', await response.text());
            }
        } catch (error) {
            console.error('게시물 작성 오류:', error);
        }
    });

    // 검색 버튼 이벤트
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', async () => {
        const query = document.getElementById('gameSearchQuery').value;
        try {
            const response = await fetch('/api/game/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });

            const results = await response.json();
            const postList = document.getElementById('post-list-container');
            postList.innerHTML = ''; // 기존 게시물 초기화

            results.forEach((post) => {
                const postElement = document.createElement('div');
                postElement.className = 'post';
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <div>${post.content}</div>
                `;
                postList.appendChild(postElement);
            });
        } catch (error) {
            console.error('검색 오류:', error);
        }
    });
}

// 채팅 전송
document.getElementById('sendChatButton').addEventListener('click', async () => {
    const chatBox = document.getElementById('chat-box');
    const message = document.getElementById('chat-message').value;

    if (message.trim() === '') return;

    const newMessage = document.createElement('div');
    newMessage.textContent = `You: ${message}`;
    chatBox.appendChild(newMessage);
    document.getElementById('chat-message').value = '';
});
