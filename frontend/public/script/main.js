
import {FetchandRenderFeed, handlePost} from "./feed.js";

document.addEventListener("DOMContentLoaded",() => {
    
    FetchandRenderFeed();

    const postContent = document.getElementById("post-content");
    const createPost = document.getElementById("create-post")
    const addPost = document.getElementById("btn-post");

    postContent.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      
      if (event.shiftKey) {
      } 
      else {
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
    }
    else{
        handlePost();
    }
    });

    // const addComment = document.getElementById("btn-comment");
    // addComment.addEventListener("click", () => {
    //     handleComment();
    // })
    
    // const addLike = document.getElementById("btn-like");
    // addLike.addEventListener("click", () =>{
    //     handleLike();
    // })
    
})