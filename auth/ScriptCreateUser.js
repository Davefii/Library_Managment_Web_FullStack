import { registerMember } from "../API_service_layer/Users.js";

const signupForm = document.getElementById("signup-form");
const signupEmail = document.getElementById("signup-email");
const signupFullName = document.getElementById("signup-full-name");
const signupPhoneNumber = document.getElementById("signup-phone-number");
const signupAddress = document.getElementById("signup-address");
const signupPassword = document.getElementById("signup-password");
const confirmPassword = document.getElementById("confirm-password");

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (signupPassword.value !== confirmPassword.value) {
        alert("Passwords do not match.");
        return;
    }

    try {
        await registerMember({
            email: signupEmail.value.trim(),
            password: signupPassword.value,
            fullName: signupFullName.value.trim(),
            phoneNumber: signupPhoneNumber.value.trim(),
            address: signupAddress.value.trim()
        });

        alert("Account created. You can now sign in.");
        window.location.href = "Login.html";
    } catch (error) {
        alert(error.message);
    }
});
