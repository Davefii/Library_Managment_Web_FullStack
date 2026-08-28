const API_URL = "https://localhost:7010/";

async function handleResponse(response) {

    if (!response.ok) {

        let message = `Request failed: ${response.status}`;

        try {
            const error = await response.text();

            if (error) {
                message = error;
            }
        }
        catch {
            // Ignore response parsing error
        }

        throw new Error(message);
    }

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
        return await response.json();
    }

    return await response.text();
}

// GET ALL USERS
export async function getAllUsers() {

    const response = await fetch(
        `${API_URL}GetAllUsers`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// GET USER BY ID
export async function getUserById(id) {

    const response = await fetch(
        `${API_URL}GetUserBy${id}`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// CREATE MEMBER USER
// This endpoint is [AllowAnonymous]
export async function registerMember(user) {

    const response = await fetch(
        `${API_URL}CreateUserOnlyMember`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: user.email,
                password: user.password
            })
        }
    );

    return await handleResponse(response);
}


// ADD USER - ADMIN
export async function addUser(user) {

    const response = await fetch(
        `${API_URL}AddUser`,
        {
            method: "POST",
            credentials: "include",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(user)
        }
    );

    return await handleResponse(response);
}


// UPDATE USER
export async function updateUser(id, user) {

    const response = await fetch(
        `${API_URL}UpdateUserBy${id}`,
        {
            method: "PUT",
            credentials: "include",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(user)
        }
    );

    return await handleResponse(response);
}


// DELETE USER
export async function deleteUser(id) {

    const response = await fetch(
        `${API_URL}DeleteUserBy${id}`,
        {
            method: "DELETE",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}

// =====================================================
// AUTHENTICATION
// =====================================================

// LOGIN
export async function login(email, password) {

    const response = await fetch(
        `${API_URL}api/Auth/Login`,
        {
            method: "POST",

            credentials: "include",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        }
    );

    return await handleResponse(response);
}


// REFRESH ACCESS TOKEN
export async function refreshAccessToken() {

    const response = await fetch(
        `${API_URL}api/Auth/refresh`,
        {
            method: "POST",

            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// LOGOUT
export async function logout() {

    const response = await fetch(
        `${API_URL}api/Auth/Logout`,
        {
            method: "POST",

            credentials: "include"
        }
    );

    return await handleResponse(response);
}
