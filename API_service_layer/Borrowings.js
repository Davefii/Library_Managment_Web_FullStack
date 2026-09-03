const API_URL = "https://localhost:7010/api/Borrowings/";

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
        `${API_URL}GetBorrowingBy/${id}`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// ADD BORROWING
export async function addBorrowing(borrowing) {

    const payload = {
        memberId: Number(borrowing.MemberId ?? borrowing.memberId),
        bookId: Number(borrowing.BookId ?? borrowing.bookId),
        borrowDate: borrowing.BorrowDate ?? borrowing.borrowDate ?? new Date().toISOString()
    };

    const response = await fetch(
        `${API_URL}AddBorrowing`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        }
    );

    return await handleResponse(response);
}


// UPDATE BORROWING
export async function updateBorrowing(id, borrowing) {

    const payload = {
        memberId: Number(borrowing.MemberId ?? borrowing.memberId),
        bookId: Number(borrowing.BookId ?? borrowing.bookId),
        borrowDate: borrowing.BorrowDate ?? borrowing.borrowDate ?? new Date().toISOString()
    };

    const response = await fetch(
        `${API_URL}UpdateBorrowing/${id}`,
        {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
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


// GET RECENT BORROWINGS FOR CURRENT MEMBER
export async function getRecentBorrowingsForMember() {

    const response = await fetch(
        `${API_URL}RecentBorrowingsForMember`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// GET RECENT BORROWINGS FOR MEMBER
export async function getRecentBorrowingsForMemberById(memberId) {

    const response = await fetch(
        `${API_URL}RecentBorrowingsForMember/${encodeURIComponent(memberId)}`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// GET TOTAL BORROWINGS FOR CURRENT MEMBER
export async function getTotalBorrowingsForMember() {

    const response = await fetch(
        `${API_URL}TotalBorrowingsForMember`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// GET TOTAL BORROWINGS FOR MEMBER
export async function getTotalBorrowingsForMemberById(memberId) {

    const response = await fetch(
        `${API_URL}TotalBorrowingsForMember/${encodeURIComponent(memberId)}`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// GET ACTIVE BORROWINGS FOR CURRENT MEMBER
export async function getActiveBorrowingsForMember() {

    const response = await fetch(
        `${API_URL}ActiveBorrowingsForMember`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// GET ACTIVE BORROWINGS FOR MEMBER
export async function getActiveBorrowingsForMemberById(memberId) {

    const response = await fetch(
        `${API_URL}ActiveBorrowingsForMember/${encodeURIComponent(memberId)}`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// GET RETURNED BORROWINGS FOR CURRENT MEMBER
export async function getReturnedBorrowingsForMember() {

    const response = await fetch(
        `${API_URL}ReturnedBorrowingsForMember`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// GET RETURNED BORROWINGS FOR MEMBER
export async function getReturnedBorrowingsForMemberById(memberId) {

    const response = await fetch(
        `${API_URL}ReturnedBorrowingsForMember/${encodeURIComponent(memberId)}`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// GET OVERDUE BORROWINGS FOR CURRENT MEMBER
export async function getOverdueBorrowingsForMember() {

    const response = await fetch(
        `${API_URL}OverdueBorrowingsForMember`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// GET OVERDUE BORROWINGS FOR MEMBER
export async function getOverdueBorrowingsForMemberById(memberId) {

    const response = await fetch(
        `${API_URL}OverdueBorrowingsForMember/${encodeURIComponent(memberId)}`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}