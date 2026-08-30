const API_URL = "https://localhost:7010/api/Authors/";

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

// GET ALL AUTHORS For Presentation
export async function getAuthorsForAnyone() {

    const response = await fetch(
        `${API_URL}ListAuthorsForAnyone`,
        {
            method: "GET"
        }
    );

    return await handleResponse(response);
}
// GET ALL AUTHORS
export async function getAuthors() {

    const response = await fetch(
        `${API_URL}ListAuthors`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// GET AUTHOR BY ID
export async function getAuthorById(id) {

    const response = await fetch(
        `${API_URL}GetAuthorBy${id}`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// ADD AUTHOR
export async function addAuthor(author) {

    const formData = new FormData();

    formData.append("FirstName", author.firstName);
    formData.append("LastName", author.lastName);

    if (author.biography) {
        formData.append("Biography", author.biography);
    }

    if (author.nationality) {
        formData.append("Nationality", author.nationality);
    }

    if (author.birthDate) {
        formData.append("BirthDate", author.birthDate);
    }

    if (author.imageAuthor) {
        formData.append("ImageAuthor", author.imageAuthor);
    }

    const response = await fetch(
        `${API_URL}AddAuthor`,
        {
            method: "POST",
            credentials: "include",
            
            body: formData
        }
    );

    return await handleResponse(response);
}


// UPDATE AUTHOR
export async function updateAuthor(id, author) {

    const formData = new FormData();

    if (author.firstName) {
        formData.append("FirstName", author.firstName);
    }

    if (author.lastName) {
        formData.append("LastName", author.lastName);
    }

    if (author.biography) {
        formData.append("Biography", author.biography);
    }

    if (author.nationality) {
        formData.append("Nationality", author.nationality);
    }

    if (author.birthDate) {
        formData.append("BirthDate", author.birthDate);
    }

    if (author.imageAuthor) {
        formData.append("ImageAuthor", author.imageAuthor);
    }

    // Required according to your UpdateAuthorRequest
    formData.append("AuthorName", author.authorName);
    formData.append("Category", author.category);

    const response = await fetch(
        `${API_URL}UpdateAuthor${id}`,
        {
            method: "PUT",
            credentials: "include",
            body: formData
        }
    );

    return await handleResponse(response);
}


// DELETE AUTHOR
export async function deleteAuthor(id) {

    const response = await fetch(
        `${API_URL}DeleteAuthor${id}`,
        {
            method: "DELETE",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}