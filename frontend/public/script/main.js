
import { FetchandRenderFeed, handlePost , handleDelete, handleLike, applyFilterAndRender } from "./feed.js";

document.addEventListener("DOMContentLoaded", () => {


  displaySkeletonLoaders(); 


  const postContent = document.getElementById("post-content");
  const createPost = document.getElementById("create-post");
  const addPost = document.getElementById("btn-post");

  postContent.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      if (event.shiftKey) { } else {
        event.preventDefault();
        addPost.click();
      }
    }
  });

  createPost.addEventListener('submit', function(event) {
    event.preventDefault();
    const content = postContent.value.trim();
    if (!content) {
      return alert('กรุณาป้อนข้อความก่อนโพสต์');
    } else {
      handlePost();
    }
  });


  const postsList = document.querySelector('#post-list');
  postsList.addEventListener('click', async (e) => {

    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn && postsList.contains(deleteBtn)) {
      const postId = deleteBtn.dataset.id;
      if (!postId) return;
      if (!confirm('แน่ใจจะลบรายการนี้หรือไม่?')) return;
      try {
        handleDelete(postId);
      } catch (err) {
        console.error(err);
        alert('เกิดข้อผิดพลาดเครือข่าย: ' + err.message);
      }
      return;
    }

    const likeBtn = e.target.closest('.like-btn');
    if (likeBtn && postsList.contains(likeBtn)) {
      const postId = likeBtn.dataset.id;
      if (!postId) return;
      likeBtn.disabled = true;
      try {
        await handleLike(postId);
      } catch (err) {
        console.error(err);
        alert(err.message);
      } finally {
        likeBtn.disabled = false;
      }
      return;
    }
  });  


  const refreshFabButton = document.getElementById('refresh-fab');
  const refreshFabWrapper = document.getElementById('refresh-wrapper');

  if (refreshFabButton) {
      refreshFabButton.addEventListener('click', () => {
        location.reload();
      });
  }
  if (refreshFabWrapper) {
    const fabTriggerPoint = refreshFabWrapper.offsetTop;
    function checkScroll() {
      if (window.scrollY > fabTriggerPoint) {
        refreshFabButton.classList.add('is-floating');
      } else {
        refreshFabButton.classList.remove('is-floating');
      }
    }
    window.addEventListener('scroll', checkScroll);
    checkScroll();
  }



  const titleMappings = {
    'date': 'โพสต์ล่าสุด🕑',
    'likes': 'โพสต์เด็ด🔥',
    'mine': 'โพสต์ของฉัน✍️'
  };

  const sortSelect = document.getElementById('sort-select');
  const feedTitle = document.getElementById('feed-title');


  const savedFilter = localStorage.getItem('chulaFilter') || 'date';
  sortSelect.value = savedFilter;
  feedTitle.textContent = titleMappings[savedFilter] || titleMappings['date'];


  if (sortSelect && feedTitle) {
      sortSelect.addEventListener('change', () => {
        const selectedValue = sortSelect.value;
        

        feedTitle.textContent = titleMappings[selectedValue] || titleMappings['date'];

        applyFilterAndRender(selectedValue);
      });
  }

});

function displaySkeletonLoaders() {
  const postList = document.getElementById('post-list');
  if (!postList) return; 
  let skeletonHTML = ''; 
  const skeletonCount = 3; 
  const singleSkeleton = `
    <div class="skeleton-post">
      <div class="skeleton-line medium"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    </div>
  `;
  for (let i = 0; i < skeletonCount; i++) {
    skeletonHTML += singleSkeleton;
  }
  postList.innerHTML = skeletonHTML;
}