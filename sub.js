function addPost(event) {
    event.preventDefault();
    const title = document.getElementById("post-title").value;
    const content = document.getElementById("post-content").value;
    
    const postList = document.querySelector("#post-list .post-list");
    const newPost = document.createElement("article");
    newPost.classList.add("post");
    newPost.innerHTML = `
        <h3>${title}</h3>
        <p>${content}</p>
        <button onclick="viewPost('${title}')">자세히 보기</button>
    `;
    postList.prepend(newPost);  // 최신 게시물이 위로 오도록
    
    document.getElementById("post-title").value = '';
    document.getElementById("post-content").value = '';
    alert("게시물이 작성되었습니다!");
}
function searchPosts() {
    const query = document.querySelector(".search-bar input[type='text']").value;
    alert(`'${query}'에 대한 검색을 시작합니다.`);
}