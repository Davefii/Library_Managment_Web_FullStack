import { login } from "../API_service_layer/Users.js";
const Email = document.getElementById("email");
const Password = document.getElementById("password");
const LoginBtn = document.getElementById("LoginBtn");
async function Login(event) {
    event.preventDefault();
    try {
        const loginUser = await login(Email.value.trim(),Password.value.trim());
        if (loginUser) {
            //localStorage.setItem("")
            alert("Login successful");
            window.open("../MemberDashboard/MemberDashboard.html");
            window.close();
        } else {
            alert("Login failed");
        }
    } catch (error) {
        alert(error.message);
    }
}
LoginBtn.addEventListener("click",Login);