import { BACKEND_URL } from "./config.js";


export function getAuthToken() {
  return sessionStorage.getItem('authToken');
}


export function getUserIdFromToken() {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    return payload.id;
  } catch (e) {
    console.error("Error decoding token", e);
    return null;
  }
}

export async function getPosts() {
  const items = await fetch(`${BACKEND_URL}/posts`).then((r) => r.json());
  return items;
}

export async function createPost(post) {
  const token = getAuthToken();
  if (!token) {
    throw new Error("ไม่ได้ login");
  }
  const response = await fetch(`${BACKEND_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'โพสต์ไม่ได้อ่ะ เสียใจด้วยนะ');
  }
  return response.json();
}

export async function userLogin(newUser) {
  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.Error || 'Failed to register');
  }
  
  const data = await response.json();
  
  if (data.token) {

    sessionStorage.setItem('authToken', data.token);
    sessionStorage.setItem('username', data.user.username);
    sessionStorage.setItem('userID', data.user._id);
  }
  
  return data;
}

export async function userRegister(newUser) {
  const response = await fetch(`${BACKEND_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.username || error.password || 'Failed to register');
  }
  
  const data = await response.json();
  
  if (data.token) {
    sessionStorage.setItem('authToken', data.token);
    sessionStorage.setItem('username', data.user.username);
    sessionStorage.setItem('userID', data.user._id);
  }
  
  return data;
}

export async function deletePost(postId) {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Need to login first!!");
  }

  const response = await fetch(`${BACKEND_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'ลบไม่สำเร็จ');
  }
  return response.json();
}


export async function toggleLikePost(postId) { 
  const token = getAuthToken();
  if (!token) {
    throw new Error("ไม่ได้ login");
  }
  
  const response = await fetch(`${BACKEND_URL}/posts/${postId}/like`, { 
    method: "PUT", 
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'กดไลก์ไม่สำเร็จ');
  }
  return response.json();
}

