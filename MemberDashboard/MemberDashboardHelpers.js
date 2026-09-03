export function getValue(object, ...keys) {
    if (!object || typeof object !== "object") return undefined;

    for (const key of keys) {
        if (object[key] !== undefined && object[key] !== null) return object[key];
        const matchingKey = Object.keys(object).find(
            objectKey => objectKey.toLowerCase() === key.toLowerCase()
        );
        if (matchingKey) return object[matchingKey];
    }

    return undefined;
}

export function unwrapResponse(response) {
    if (!response || typeof response !== "object") return response;
    return getValue(response, "data", "result") ?? response;
}

export function getList(response) {
    const value = unwrapResponse(response);
    if (Array.isArray(value)) return value;
    return getValue(value, "items", "borrowings", "books") ?? [];
}

export function getCount(response) {
    const value = unwrapResponse(response);
    if (Array.isArray(value)) return value.length;
    if (typeof value === "number") return value;
    const list = getValue(value, "items", "borrowings", "books");
    if (Array.isArray(list)) return list.length;
    return getValue(value, "count", "total", "value", "totalBorrowings") ?? 0;
}

export function getMember(response) {
    const value = unwrapResponse(response);
    return getValue(value, "member") ?? value ?? {};
}

export function formatDate(value) {
    if (!value) return "--";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

export function renderError(error) {
    const message = error instanceof Error ? error.message : "Unable to load dashboard data.";
    document.querySelectorAll(".empty-state").forEach(element => {
        element.textContent = message;
    });
}

export function createStatusBadge(status) {
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

export function renderBorrowingsTable(table, borrowings, emptyMessage, dateKey) {
    if (!table) return;
    table.replaceChildren();

    if (!borrowings.length) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 4;
        cell.className = "empty-state";
        cell.textContent = emptyMessage;
        row.appendChild(cell);
        table.appendChild(row);
        return;
    }

    borrowings.slice(0, 5).forEach(borrowing => {
        const row = document.createElement("tr");
        const book = document.createElement("td");
        const borrowDate = document.createElement("td");
        const secondaryDate = document.createElement("td");
        const status = document.createElement("td");

        book.textContent = getValue(borrowing, "bookTitle", "title", "bookName") ?? "--";
        borrowDate.textContent = formatDate(getValue(borrowing, "borrowDate"));
        secondaryDate.textContent = formatDate(getValue(borrowing, dateKey));
        status.appendChild(createStatusBadge(getValue(borrowing, "status")));
        row.append(book, borrowDate, secondaryDate, status);
        table.appendChild(row);
    });
}
