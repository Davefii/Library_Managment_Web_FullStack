const API_URL = "https://localhost:7010/";

async function handleResponse(response) {

    let body = null;

    try {
        body = await response.json();
    } catch {
        // Response has no JSON body
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

// GET ALL CATEGORIES
export async function getCategoriesForAnyone() {

    const response = await fetch(
        `${API_URL}GetAllCategorysForAnyone`,
        {
            method: "GET"
        }
    );

    return await handleResponse(response);
}

// GET ALL CATEGORIES
export async function getCategories() {

    const response = await fetch(
        `${API_URL}GetAllCategorys`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// GET CATEGORY BY ID
export async function getCategoryById(id) {

    const response = await fetch(
        `${API_URL}GetCategoryBy${id}`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// CREATE CATEGORY
export async function createCategory(category) {

    const response = await fetch(
        `${API_URL}CreateCategory`,
        {
            method: "POST",
            credentials: "include",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: category.name,
                description: category.description,
                parentId: category.parentId
            })
        }
    );

    return await handleResponse(response);
}


// UPDATE CATEGORY
export async function updateCategory(id, category) {

    const response = await fetch(
        `${API_URL}UpdateCategoryBy${id}`,
        {
            method: "PUT",
            credentials: "include",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: category.name,
                description: category.description,
                parentId: category.parentId
            })
        }
    );

    return await handleResponse(response);
}


// DELETE CATEGORY
export async function deleteCategory(id) {

    const response = await fetch(
        `${API_URL}DeleteCategoryBy${id}`,
        {
            method: "DELETE",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}

/*{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJKZW1lczEyM0BleGFtcGxlLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjoxNzg2NDgwMDE4LCJpc3MiOiJMaWJyYXJ5QXBpIiwiYXVkIjoiTGlicmFyeVVzZXJzIn0.8l3hptx72iwblW_jBWSSC0T7qNpb_Z3RMpSF6PsnNsw",
  "refreshToken": "zoMQ7C3rFgePT5MzS09ep4fF5463RAHL2RXX9yd/z7y80ZGUhYKImcX45j49sdcgke5XaoWyhDifDvuD04uHVA=="
}*/