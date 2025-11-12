// ----------------------
// Simple frontend (localStorage) posts + likes + comments
// Clean, self-contained implementation to avoid runtime errors
// ----------------------
let posts = JSON.parse(localStorage.getItem('posts') || '[]');

function savePosts() {
	localStorage.setItem('posts', JSON.stringify(posts));
}

function ensurePostShape(p) {
	p.comments = p.comments || [];
	p.likedBy = p.likedBy || [];
	p.likes = p.likes || p.likedBy.length || 0;
}

// Render feed
function renderFeed() {
	document.getElementById('feed').style.display = 'block';
	document.getElementById('thread-view').style.display = 'none';

	const list = document.getElementById('post-list');
	list.innerHTML = '';

	if (posts.length === 0) {
		list.innerHTML = '<p>ยังไม่มีโพสต์เลย 🕊️</p>';
		return;
	}

	posts
		.sort((a, b) => b.createdAt - a.createdAt)
		.forEach((p) => {
			ensurePostShape(p);

			// ensure a stable user token per browser for this post
			const userTokenKey = `user_token_${p.id}`;
			let userToken = localStorage.getItem(userTokenKey);
			if (!userToken) {
				userToken = Math.random().toString(36).substring(2, 10);
				localStorage.setItem(userTokenKey, userToken);
			}

			const hasLiked = p.likedBy.includes(userToken);

			const div = document.createElement('div');
			div.className = 'post';
			div.innerHTML = `
				<p class="post-text" data-id="${p.id}">${p.content}</p>
				<div class="post-actions">
					<button class="like-btn${hasLiked ? ' liked' : ''}" data-id="${p.id}">
						${hasLiked ? '❤️' : '🤍'} ${p.likes}
					</button>
					<button class="comment-btn" data-id="${p.id}">💬 ${p.comments.length}</button>
					<time>${new Date(p.createdAt).toLocaleString()}</time>
				</div>
			`;

			list.appendChild(div);
		});

	// attach handlers
	document.querySelectorAll('.like-btn').forEach((btn) => {
		btn.addEventListener('click', function (e) {
			e.preventDefault();
			e.stopPropagation();
			const id = Number(this.dataset.id);
			const post = posts.find((x) => x.id === id);
			if (!post) return;

			const userToken = localStorage.getItem(`user_token_${id}`);
			if (!userToken) return;

			// toggle like locally
			post.likedBy = post.likedBy || [];
			const idx = post.likedBy.indexOf(userToken);
			if (idx === -1) {
				post.likedBy.push(userToken);
			} else {
				post.likedBy.splice(idx, 1);
			}
			post.likes = post.likedBy.length;
			savePosts();
			renderFeed();
		});
	});

	document.querySelectorAll('.comment-btn').forEach((btn) => {
		btn.addEventListener('click', function (e) {
			e.preventDefault();
			e.stopPropagation();
			const id = Number(this.dataset.id);
			openThread(id);
		});
	});

	document.querySelectorAll('.post-text').forEach((el) => {
		el.addEventListener('click', function () {
			const id = Number(this.dataset.id);
			openThread(id);
		});
	});
}

// Create new post
document.getElementById('btn-post').addEventListener('click', () => {
	const content = document.getElementById('post-content').value.trim();
	if (!content) return alert('พิมพ์ข้อความก่อนโพสต์สิ!');

	const newPost = {
		id: Date.now(),
		content,
		createdAt: Date.now(),
		likes: 0,
		likedBy: [],
		comments: [],
		token: Math.random().toString(36).substring(2, 10),
	};

	posts.push(newPost);
	savePosts();
	document.getElementById('post-content').value = '';
	document.getElementById('token-display').textContent = `🔑 โค้ดสำหรับแก้ไข/ลบโพสต์นี้: ${newPost.token}`;
	renderFeed();
});

// Thread view
function openThread(id) {
	const post = posts.find((p) => p.id === id);
	if (!post) return;

	ensurePostShape(post);

	document.getElementById('feed').style.display = 'none';
	const view = document.getElementById('thread-view');
	view.style.display = 'block';

	const userTokenKey = `user_token_${post.id}`;
	let userToken = localStorage.getItem(userTokenKey);
	if (!userToken) {
		userToken = Math.random().toString(36).substring(2, 10);
		localStorage.setItem(userTokenKey, userToken);
	}

	const hasLiked = post.likedBy.includes(userToken);

	const content = document.getElementById('thread-content');
	content.innerHTML = `
		<div class="post">
			<p>${post.content}</p>
			<div class="post-actions">
				<button class="like-btn${hasLiked ? ' liked' : ''}" data-id="${post.id}">
					${hasLiked ? '❤️' : '🤍'} ${post.likes}
				</button>
				<time>${new Date(post.createdAt).toLocaleString()}</time>
			</div>
		</div>
	`;

	// like in thread view
	const likeBtn = content.querySelector('.like-btn');
	likeBtn.addEventListener('click', function (e) {
		e.preventDefault();
		e.stopPropagation();
		const userToken = localStorage.getItem(userTokenKey);
		if (!userToken) return;

		post.likedBy = post.likedBy || [];
		const idx = post.likedBy.indexOf(userToken);
		if (idx === -1) post.likedBy.push(userToken);
		else post.likedBy.splice(idx, 1);
		post.likes = post.likedBy.length;
		savePosts();
		openThread(id); // re-render thread view to update state
	});

	renderComments(post);
}

// Comment system
document.getElementById('btn-comment').addEventListener('click', () => {
	const text = document.getElementById('comment-text').value.trim();
	if (!text) return alert('พิมพ์ข้อความก่อนคอมเมนต์!');
	const view = document.getElementById('thread-view');
	const likeBtn = view.querySelector('.like-btn');
	if (!likeBtn) return;
	const id = Number(likeBtn.dataset.id);
	const post = posts.find((p) => p.id === id);
	if (!post) return;

	post.comments.push({ id: Date.now(), text, createdAt: Date.now() });
	savePosts();
	document.getElementById('comment-text').value = '';
	renderComments(post);
	renderFeed();
});

function renderComments(post) {
	const list = document.getElementById('comment-list');
	list.innerHTML = '';
	if (!post.comments || post.comments.length === 0) {
		list.innerHTML = '<p>ยังไม่มีความคิดเห็นเลย 💬</p>';
		return;
	}
	post.comments.forEach((c) => {
		const div = document.createElement('div');
		div.className = 'comment';
		div.innerHTML = `
			<p>${c.text}</p>
			<time>${new Date(c.createdAt).toLocaleString()}</time>
		`;
		list.appendChild(div);
	});
}

// Back to main feed
document.getElementById('back-btn').addEventListener('click', () => {
	renderFeed();
});

// initial render
renderFeed();
