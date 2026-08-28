const API_URL = "https://localhost:7010/api/Books/";

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
export async function BooksListForAnyone() {
    

        const response  = await fetch(
      `${API_URL}ListBooksForAnyone`,
        {
            method: "GET"
        }
    );
    return await handleResponse(response);
}
export async function BooksList() {
    

        const response  = await fetch(
      `${API_URL}ListBooks`,
        {
            method: "GET",
            credentials: "include"
        }
    );
    return await handleResponse(response);
}
export async function GetBookByID(ID) {

        const response  = await fetch(
      `${API_URL}GetBookByID${ID}`,
        {
            method: "GET",
            credentials: "include"
        }
    );
    return await handleResponse(response);
}
export async function GetBookByName(NameBook) {

        //const parmss = new URLSearchParams({});
            const response  = await fetch(
      `${API_URL}GetBookByName/${NameBook}`,
        {
            method: "GET",
            credentials: "include"
        }
    );
    return await handleResponse(response);
}
export async function GetbookByISBN(ISBN) {

            const response  = await fetch(
      `${API_URL}GetBookByISBN/${ISBN}`,
        {
            method: "GET",
            credentials: "include"
        }
    );
    return await handleResponse(response);
}
export async function deleteBook(id) {

            const response = await fetch(
        `${API_URL}DeleteBookBy${id}`,
        {
            method: "DELETE",
            credentials: "include"
        }
    );
    return await handleResponse(response);
}
export async function addBook(book) {

    const formData = new FormData();

    formData.append("Title", book.title);
    formData.append("ISBN", book.isbn);
    formData.append("Description", book.description);
    formData.append("PublishYear", book.publishYear);
    formData.append("TotalCopies", book.totalCopies);
    formData.append("AvailableCopies", book.availableCopies);
    formData.append("IsAvailable", book.isAvailable);
    formData.append("AuthorID", book.authorID);
    formData.append("CategoryID", book.categoryID);


    if (book.coverImage) {
        formData.append("CoverImage", book.coverImage);
    }

    const response = await fetch(
        `${API_URL}AddBook`,
        {
            method: "POST",
            credentials: "include",
            body: formData
        }
    );

    return await handleResponse(response);
}
export async function updateBook(id, book) {

    const formData = new FormData();

    formData.append("Title", book.title);
    formData.append("ISBN", book.isbn);
    formData.append("Description", book.description);
    formData.append("PublishYear", book.publishYear);
    formData.append("TotalCopies", book.totalCopies);
    formData.append("AvailableCopies", book.availableCopies);
    formData.append("IsAvailable", book.isAvailable);
    formData.append("AuthorID", book.authorID);
    formData.append("CategoryID", book.categoryID);


    if (book.coverImage) {
        formData.append("CoverImage", book.coverImage);
    }

    const response = await fetch(
        `${API_URL}UpdateBookBy${id}`,
        {
            method: "PUT",
            credentials: "include",
            body: formData
        }
    );

    return await handleResponse(response);
}

