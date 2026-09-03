// MemberDashboard.js
// UI layer. Connect this file to your MemberDashboard API service layer.

const elements = {
    memberName: document.getElementById("memberName"),
    membershipStatus: document.getElementById("membershipStatus"),
    membershipExpiry: document.getElementById("membershipExpiry"),
    totalBorrowings: document.getElementById("totalBorrowings"),
    activeBorrowings: document.getElementById("activeBorrowings"),
    returnedBooks: document.getElementById("returnedBooks"),
    overdueBooks: document.getElementById("overdueBooks"),
    currentBorrowingsTable: document.getElementById("currentBorrowingsTable"),
    recentBorrowingsTable: document.getElementById("recentBorrowingsTable"),
    profileName: document.getElementById("profileName"),
    profileEmail: document.getElementById("profileEmail"),
    profilePhone: document.getElementById("profilePhone"),
    profileAddress: document.getElementById("profileAddress"),
    editProfileButton: document.getElementById("editProfileButton")
};

function formatDate(value) {
    if (!value) return "--";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

function createStatusBadge(status) {
    const badge = document.createElement("span");
    const normalized = String(status ?? "").toLowerCase();
    badge.className = "badge " + (
        normalized === "returned" ? "badge--success" :
        normalized === "overdue" ? "badge--danger" :
        "badge--warning"
    );
    badge.textContent = status ?? "--";
    return badge;
}

function renderCurrentBorrowings(borrowings = []) {
    if (!elements.currentBorrowingsTable) return;
    elements.currentBorrowingsTable.replaceChildren();

    if (!borrowings.length) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 4;
        cell.className = "empty-state";
        cell.textContent = "No active borrowings.";
        row.appendChild(cell);
        elements.currentBorrowingsTable.appendChild(row);
        return;
    }

    borrowings.forEach(borrowing => {
        const row = document.createElement("tr");
        const book = document.createElement("td");
        const borrowDate = document.createElement("td");
        const dueDate = document.createElement("td");
        const status = document.createElement("td");

        book.textContent = borrowing.bookTitle ?? "--";
        borrowDate.textContent = formatDate(borrowing.borrowDate);
        dueDate.textContent = formatDate(borrowing.dueDate);
        status.appendChild(createStatusBadge(borrowing.status));

        row.append(book, borrowDate, dueDate, status);
        elements.currentBorrowingsTable.appendChild(row);
    });
}

function renderRecentBorrowings(borrowings = []) {
    if (!elements.recentBorrowingsTable) return;
    elements.recentBorrowingsTable.replaceChildren();

    if (!borrowings.length) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 4;
        cell.className = "empty-state";
        cell.textContent = "No recent borrowings.";
        row.appendChild(cell);
        elements.recentBorrowingsTable.appendChild(row);
        return;
    }

    borrowings.slice(0, 5).forEach(borrowing => {
        const row = document.createElement("tr");
        const book = document.createElement("td");
        const borrowDate = document.createElement("td");
        const returnDate = document.createElement("td");
        const status = document.createElement("td");

        book.textContent = borrowing.bookTitle ?? "--";
        borrowDate.textContent = formatDate(borrowing.borrowDate);
        returnDate.textContent = formatDate(borrowing.returnDate);
        status.appendChild(createStatusBadge(borrowing.status));

        row.append(book, borrowDate, returnDate, status);
        elements.recentBorrowingsTable.appendChild(row);
    });
}

function renderDashboard(data) {
    const member = data.member ?? {};
    const statistics = data.statistics ?? {};

    if (elements.memberName) elements.memberName.textContent = member.name ?? "Member";
    if (elements.membershipStatus) elements.membershipStatus.textContent = member.isActive ? "Active" : "Inactive";
    if (elements.membershipExpiry) elements.membershipExpiry.textContent = formatDate(member.membershipExpiryDate);

    if (elements.totalBorrowings) elements.totalBorrowings.textContent = statistics.totalBorrowings ?? 0;
    if (elements.activeBorrowings) elements.activeBorrowings.textContent = statistics.activeBorrowings ?? 0;
    if (elements.returnedBooks) elements.returnedBooks.textContent = statistics.returnedBooks ?? 0;
    if (elements.overdueBooks) elements.overdueBooks.textContent = statistics.overdueBooks ?? 0;

    if (elements.profileName) elements.profileName.textContent = member.name ?? "--";
    if (elements.profileEmail) elements.profileEmail.textContent = member.email ?? "--";
    if (elements.profilePhone) elements.profilePhone.textContent = member.phone ?? "--";
    if (elements.profileAddress) elements.profileAddress.textContent = member.address ?? "--";

    renderCurrentBorrowings(data.currentlyBorrowedBooks);
    renderRecentBorrowings(data.recentBorrowings);
}

elements.editProfileButton?.addEventListener("click", () => {
    // Connect this button to your existing Update My Information page.
    console.log("Open member profile editor");
});

// Later:
// import * as MemberDashboard from "../../API_service_layer/MemberDashboard.js";
// const data = await MemberDashboard.getMemberDashboard();
// renderDashboard(data);
