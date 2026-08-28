import * as Books from "../../API_service_layer/Books.js";
const Book = await Books.BooksList();
const tbody = document.getElementById("booksTableBody");
const createBook = document.getElementById("createBook");
function LoadBooks() {
    tbody.replaceChildren();

    Book.forEach(book => {
        const row = document.createElement("tr");
        const isAvailable = book.isAvailable ?? book.IsAvailable;
        const authorNames = (book.authors ?? [])
            .map(author => `${author.firstName} ${author.lastName}`)
            .join(", ");
        const categoryNames = (book.categories ?? [])
            .map(category => category.name)
            .join(", ");

        row.innerHTML = `
            <td>${book.id ?? book.ID ?? ""}</td>
            <td><img style="width: 40px; height: 56px; object-fit: cover;" src="https://localhost:7010/${book.coverImage ?? book.CoverImage ?? ""}" alt="Book cover" /></td>
            <td>${book.title ?? book.Title ?? ""}</td>
            <td>${book.isbn ?? book.ISBN ?? ""}</td>
            <td>${authorNames || book.authorName || book.AuthorName || ""}</td>
            <td>${categoryNames || book.categoryName || book.CategoryName || ""}</td>
            <td>${book.copiesCount ?? book.TotalCopies ?? ""}</td>
            <td>${book.publishYear ?? ""}</td>
            <td><span class="badge ${isAvailable ? "badge--success" : "badge--danger"}">${isAvailable ? "Available" : "Unavailable"}</span></td>
            <td class="actions">
                <a href="#" data-action="update" data-bookid="${book.id ?? book.ID ?? ""}">Update</a>
                <a href="#" data-action="delete" data-bookid="${book.id ?? book.ID ?? ""}">Delete</a>
            </td>
        `;

        tbody.appendChild(row);
    });
}
function OpenAddBook() {
    const url = new URL(`BookForm.html`, document.baseURI);
    window.open(url.href,  "_blank",
        "width=1000,height=800,resizable=no,scrollbars=yes"
    );
}
function  OpenUpdateBook(bookId) {
        const url = new URL(
        `BookForm.html?id=${bookId}`,
        document.baseURI
    );
    window.open(url.href,  "_blank",
        "width=1000,height=800,resizable=no,scrollbars=yes"
    );
}
tbody.addEventListener("click", async event => {
    const actionLink = event.target.closest("a[data-action]");

    if (!actionLink) {
        return;
    }

    event.preventDefault();
    const bookId = actionLink.dataset.bookid;

    if (actionLink.dataset.action === "delete") {
        try {
            await Books.deleteBook(bookId);
            actionLink.closest("tr").remove();
        } catch (error) {
            alert("Failed to delete book Because it's link on another table", error);
        }
    }
    if (actionLink.dataset.action === "update")
    {
        try {
            OpenUpdateBook(bookId);
        } catch (error) {
            alert(`Failed to Update book ${error}`);
        }
    }
});

createBook.addEventListener("click", OpenAddBook);

document.addEventListener("DOMContentLoaded", LoadBooks());