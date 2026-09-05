import { login } from "../API_service_layer/Authentication.js";
const Email = document.getElementById("email");
const Password = document.getElementById("password");
const LoginBtn = document.getElementById("LoginBtn");
let isLogin = false;
document.addEventListener("DOMContentLoaded",() =>
    {
        Email.value = localStorage.getItem("Email");
    }
);
LoginBtn.addEventListener("click", async (event) =>
    {
    event.preventDefault();
    if (Email.value === null || Email.value === undefined || Email.value === "") {
        alert("Please Write email");
        return;
    }
    if (Password.value === null || Password.value === undefined || Password.value === "") {
        alert("Please Write email");
        return;
    }
    try {
        const loginUser = await login(Email.value.trim(),Password.value.trim());
        LoginBtn.textContent = "Please wait...";
        if (loginUser) {
            LoginBtn.disabled = true;
            localStorage.setItem("Email", Email.value.trim());
            alert("Login successful");
            LoginBtn.textContent = "Login";
            //await renderUserMenu();
            window.location.href = "../home/Home.html";
        } else {
            alert("Login failed");
            return;
        }
    } catch (error) {
        alert(error.message);
    }
}
);