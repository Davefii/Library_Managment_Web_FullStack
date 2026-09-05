const API_URL = "https://localhost:7010/api/Auth/";

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
// LOGIN
export async function login(email, password) {

    const response = await fetch(
        `${API_URL}Login`,
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
        `${API_URL}refresh`,
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
        `${API_URL}Logout`,
        {
            method: "POST",

            credentials: "include"
        }
    );

    return await handleResponse(response);
}
