import { createPost , getPosts} from "./api.js";

export function RenderFeed(posts){
    document.getElementById('feed').style.display = 'block';
    document.getElementById('thread-view').style.display = 'none';

    const list = document.getElementById('post-list');
    list.innerHTML = '';

    if (!posts || posts.length === 0) {
        list.innerHTML = '<p>ยังไม่มีโพสต์เลย 🕊️</p>';
        return;
    }

    posts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .forEach((post) => {
            const div = document.createElement('div');
            div.className = 'post';
            div.innerHTML = `
                <p class="post-text" data-id="${post._id}">${post.content}</p>
                <div class="post-actions">
                    <button class="like-btn" data-id="${post._id}">
                        🤍 ${post.likes.count}
                    </button>
                    <time>${new Date(post.createdAt).toLocaleString()}</time>
                </div>
            `;

            list.appendChild(div);
        });

    // เพิ่ม event listener สำหรับปุ่ม like
    document.querySelectorAll('.like-btn').forEach((btn) => {
        btn.addEventListener('click', async function (e) {
            e.preventDefault();
            e.stopPropagation();
            const id = this.dataset.id;
            console.log('Like post:', id);
        });
    });

    document.querySelectorAll('.post-text').forEach((el) => {
        el.addEventListener('click', function () {
            const id = this.dataset.id;
            console.log('Open thread:', id);
        });
    });
}

export async function FetchandRenderFeed(){
    const posts = await getPosts();
    RenderFeed(posts);

}


export async function handlePost(){
    try {
        const content = document.getElementById('post-content').value.trim();
        const newPost = {
            content: content,
            likes: { count: 0 },
            createdAt: Date.now()
        }
        await createPost(newPost);
        document.getElementById('post-content').value = '';

        await FetchandRenderFeed();
        
    } catch (error) {
        console.error('Error creating post:', error);
        alert('Failed to create post. Please try again.');
    }

};

    

// export async function handleComment(){
    
// }

