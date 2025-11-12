import { 
  createPost, 
  getPosts, 
  deletePost, 
  toggleLikePost, 
  getUserIdFromToken  
} from "./api.js";

let allPosts = [];

export function RenderFeed(posts) {
    document.getElementById('feed').style.display = 'block';
    document.getElementById('thread-view').style.display = 'none';

    const list = document.getElementById('post-list');
    list.innerHTML = '';

    if (!posts || posts.length === 0) {
        list.innerHTML = '<p>ยังไม่มีโพสต์เลย 🕊️</p>';
        return;
    }

    const currentUserId = getUserIdFromToken(); 

    posts.forEach((post) => {
        const isLiked = post.likes.includes(currentUserId);
        
        const isMyPost = post.author && (post.author._id === currentUserId);

        const div = document.createElement('div');
        div.className = 'post';

        div.innerHTML = `
            <pr class="post-text" data-id="${post._id}">${post.content}</pr>
            <div class="post-info">
              <time>${new Date(post.createdAt).toLocaleString()}</time>
            </div>
            <div class="post-actions">
                <button class="like-btn ${isLiked ? 'liked' : ''}" data-id="${post._id}">
                    ${isLiked ? '❤️' : '🤍'} ${post.likeCount} 
                </button>
                
                ${isMyPost ? `<button class="delete-btn" data-id="${post._id}">🗑️</button>` : ''}
            </div>
        `;

        list.appendChild(div);
    });
}

/**
 * FetchandRenderFeed: ดึงข้อมูล, เก็บใน "ถัง", และสั่งแสดงผลครั้งแรก
 */
export async function FetchandRenderFeed() {
    const postList = document.getElementById('post-list');
    try {
        const posts = await getPosts();
        allPosts = posts; 
        const savedFilter = localStorage.getItem('chulaFilter') || 'date';
        
        applyFilterAndRender(savedFilter);

    } catch (error) {
        console.error("Error fetching feed:", error);
        postList.innerHTML = `<p style="color: red;">เกิดข้อผิดพลาด: ${error.message}</p>`;
    }
}


export function applyFilterAndRender(filter) {
    const currentUserId = getUserIdFromToken();
    let filteredPosts = [...allPosts];

    if (filter === "likes") {
        // กรองตาม Likes (b.likeCount - a.likeCount คือมากไปน้อย)
        filteredPosts.sort((a, b) => b.likeCount - a.likeCount);
    } else if (filter === "mine") {
        // กรองเฉพาะโพสต์ของเรา
        filteredPosts = allPosts.filter(p => p.author && p.author._id === currentUserId);
        // (โพสต์ของเราจะเรียงตามวันที่ล่าสุดโดยอัตโนมัติ)
        filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else { // 'date'
        // กรองตาม Date (ค่าเริ่มต้น)
        filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    // -------------------------

    // บันทึกตัวเลือก filter ล่าสุด
    localStorage.setItem('chulaFilter', filter);
    
    // สั่งแสดงผลโพสต์ที่กรอง/เรียงแล้ว
    RenderFeed(filteredPosts);
}



export async function handlePost(){
    try {
        const contentInput = document.getElementById('post-content');
        const content = contentInput.value.trim();
        if (!content) return; 
        
        await createPost({ content: content });
        contentInput.value = ''; 
        await FetchandRenderFeed(); // โหลดใหม่ทั้งหมด
    } catch (error) {
        console.error('Error creating post:', error);
        alert(error.message);
    }
};


export async function handleDelete(postId) {
  if (!postId) return;
  
  try {
    await deletePost(postId);
    FetchandRenderFeed(); // โหลดใหม่ทั้งหมด
  } catch (err) {
    console.error(err);
    alert('เกิดข้อผิดพลาด: ' + err.message);
  }
}

/**
 * handleLike: ไลค์/อัลไลค์, อัปเดต UI, และอัปเดต "ถัง"
 */
export async function handleLike(postId) {
  if (!postId) return;
  
  try {
    const updatedPost = await toggleLikePost(postId);
    
    const index = allPosts.findIndex(p => p._id === postId);
    if (index !== -1) {
      allPosts[index] = updatedPost;
    }
    const newLikeCount = updatedPost.likeCount;
    const currentUserId = getUserIdFromToken();
    const isLiked = updatedPost.likes.includes(currentUserId);

    const likeBtn = document.querySelector(`.like-btn[data-id="${postId}"]`);
    if (likeBtn) {
      likeBtn.textContent = `${isLiked ? '❤️' : '🤍'} ${newLikeCount}`;
      likeBtn.classList.toggle('liked', isLiked);
    }
    await FetchandRenderFeed();

  } catch (error) {
    console.error('Error toggling like:', error);
    alert(error.message);
  }

}


