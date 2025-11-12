import { userLogin, userRegister } from "./api.js";
import { FetchandRenderFeed } from "./feed.js";


const authModal = document.getElementById("auth-modal");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const loginTab = document.getElementById("login-tab");
const registerTab = document.getElementById("register-tab");
const switchToRegister = document.getElementById("switch-to-register");
const switchToLogin = document.getElementById("switch-to-login");
const tokenDisplay = document.getElementById("token-display");
const logoutButton = document.getElementById("logout-button");


loginTab.addEventListener("click", () => {
  loginForm.style.display = "block";
  registerForm.style.display = "none";
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
});

registerTab.addEventListener("click", () => {
  loginForm.style.display = "none";
  registerForm.style.display = "block";
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
});

switchToRegister.addEventListener("click", (e) => {
  e.preventDefault();
  registerTab.click();
});

switchToLogin.addEventListener("click", (e) => {
  e.preventDefault();
  loginTab.click();
});

//login handler
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const inputs = loginForm.querySelectorAll("input");
  const username = inputs[0].value.trim();
  const password = inputs[1].value.trim();

  if (!username || !password) {
    alert("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
    return;
  }
  
  try {
    await userLogin({ username : username , password : password });
    alert("เข้าสู่ระบบสำเร็จ!");
    authModal.style.display = "none"
    location.reload();
  } catch (error) {

    alert("เกิดข้อผิดพลาด: " + error.message);
    loginForm.reset();
  }
});

//Register Handler
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const inputs = registerForm.querySelectorAll("input");
  const username = inputs[0].value.trim();
  const password = inputs[1].value.trim();
  const confirmPassword = inputs[2].value.trim();

  // Validation
  if (!username || !password || !confirmPassword) {
    alert("กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  if (password !== confirmPassword) {
    alert("รหัสผ่านไม่ตรงกัน");
    return;
  }

  if (password.length < 6) {
    alert("รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร");
    return;
  }
  const newUser = {
      username,
      password
  };
  
  try {
    await userRegister(newUser);
    alert("สมัครสมาชิกสำเร็จ!");
    authModal.style.display = "none"
    location.reload();
  } catch (error) {
    alert("เกิดข้อผิดพลาด: " + error.message);
    registerForm.reset();
  }
});

// already login
window.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("authToken");
  const username = sessionStorage.getItem("username")

  if (token && username) {
    if (tokenDisplay) {
      try {
          FetchandRenderFeed();
        } catch (error) {
          console.error("เกิดข้อผิดพลาดระหว่างโหลดฟีด:", error);
        }
      tokenDisplay.innerHTML = `<h4>สวัสดี ${username}<h4>`;
    }
    if (logoutButton) {
      logoutButton.style.display = "inline-block"; 
      logoutButton.addEventListener("click", logout); 
    }
  }
  else{
    authModal.style.display = "flex";
    if (logoutButton) {
      logoutButton.style.display = "none"; 
    }
  }
});




export function logout() {
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("userID");
  sessionStorage.removeItem("username")
  loginForm.reset();
  registerForm.reset();
  if (tokenDisplay) {
    tokenDisplay.textContent = "";
  }
  location.reload();
}

