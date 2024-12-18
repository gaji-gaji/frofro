// 검색 처리
document.getElementById('searchButton').addEventListener('click', async () => {
    const searchQuery = document.getElementById('searchQuery').value;

    try {
        const response = await fetch('/api/main/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: searchQuery }),
        });

        const data = await response.json();
        console.log('검색 결과:', data);
        alert('검색 결과가 서버에서 처리되었습니다.');
    } catch (error) {
        console.error('오류 발생:', error);
    }
});

// 인기 게시물 로드
async function loadPopularPosts() {
    try {
        const response = await fetch('/api/posts/popular');
        const posts = await response.json();

        const container = document.getElementById('popularPostsContainer');
        container.innerHTML = ''; // 기존 내용을 초기화

        posts.forEach((post) => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `<h3>${post.title}</h3><p>${post.content}</p>`;
            container.appendChild(postElement);
        });
    } catch (error) {
        console.error('인기 게시물 로드 실패:', error);
    }
}

window.addEventListener('DOMContentLoaded', loadPopularPosts);
