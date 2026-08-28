const API_URL = "https://localhost:7010/api/";


// ===============================
// Response Handler
// ===============================

async function handleResponse(response) {

    let body = null;

    try {
        body = await response.json();
    } catch {
        // No JSON response body
    }

    if (!response.ok) {
        throw new Error(
            body?.message ||
            body?.title ||
            `Request failed: ${response.status}`
        );
    }

    return body;
}


// =====================================================
// USER PROFILE
// =====================================================


// GET ALL PROFILES
export async function getAllUserProfiles() {

    const response = await fetch(
        `${API_URL}UserProfile/AllProfileUser`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// GET PROFILE BY ID
export async function getUserProfileById(id) {

    const response = await fetch(
        `${API_URL}UserProfile/GetProfileBy${id}`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// CREATE PROFILE
export async function createUserProfile(profile) {

    const response = await fetch(
        `${API_URL}UserProfile/CreateProfileUser`,
        {
            method: "POST",
            credentials: "include",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(profile)
        }
    );

    return await handleResponse(response);
}


// UPDATE PROFILE
export async function updateUserProfile(id, profile) {

    const response = await fetch(
        `${API_URL}UserProfile/UpdateProfile${id}`,
        {
            method: "PUT",
            credentials: "include",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(profile)
        }
    );

    return await handleResponse(response);
}


// DELETE PROFILE
export async function deleteUserProfile(id) {

    const response = await fetch(
        `${API_URL}UserProfile/DeleteProfile${id}`,
        {
            method: "DELETE",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}