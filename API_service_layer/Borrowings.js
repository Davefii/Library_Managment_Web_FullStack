const API_URL = "https://localhost:7010/";

async function handleResponse(response) {

    let body = null;

    try {
        body = await response.json();
    } catch {
        // No JSON body
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


// GET ALL BORROWINGS
export async function getBorrowings() {

    const response = await fetch(
        `${API_URL}ListBorrowings`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// GET BORROWING BY ID
export async function getBorrowingById(id) {

    const response = await fetch(
        `${API_URL}GetBorrowingBy${id}`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// ADD BORROWING
export async function addBorrowing(borrowing) {

    const response = await fetch(
        `${API_URL}AddBorrowing`,
        {
            method: "POST",
            credentials: "include",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                memberId: borrowing.memberId,
                bookId: borrowing.bookId,
                borrowDate: borrowing.borrowDate,
                dueDate: borrowing.dueDate
            })
        }
    );

    return await handleResponse(response);
}


// UPDATE BORROWING
export async function updateBorrowing(id, borrowing) {

    const response = await fetch(
        `${API_URL}UpdateBorrowing${id}`,
        {
            method: "PUT",
            credentials: "include",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                returnDate: borrowing.returnDate,
                dueDate: borrowing.dueDate,
                isReturned: borrowing.isReturned
            })
        }
    );

    return await handleResponse(response);
}


// RETURN BOOK
export async function returnBook(id) {

    const response = await fetch(
        `${API_URL}returnBookBy${id}`,
        {
            method: "POST",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// DELETE BORROWING
export async function deleteBorrowing(id) {

    const response = await fetch(
        `${API_URL}DeleteBorrowings${id}`,
        {
            method: "DELETE",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// GET OVERDUE BOOKS
export async function getOverdueBooks() {

    const response = await fetch(
        `${API_URL}ListOverDueBooks`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}