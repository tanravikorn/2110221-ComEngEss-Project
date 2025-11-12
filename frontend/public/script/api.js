import { BACKEND_URL } from "./config.js";


export async function getPosts() {
  const items = await fetch(`${BACKEND_URL}/posts`).then((r) => r.json());

  return items;
}


export async function createPost(post) {
  const response = await fetch(`${BACKEND_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create post');
  }
  return response.json();
}


// export async function userLogin(){

// }

// export async function userRegister(){

// }