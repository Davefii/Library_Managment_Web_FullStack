import { GetBookByID, ListBooksByCategorieForAnyone } from "../API_service_layer/Books.js";
import { GetCurrentUser } from "../API_service_layer/Users.js";
import { addBorrowing } from "../API_service_layer/Borrowings.js";
import { getMe } from "../API_service_layer/Members.js";
import { renderBooks } from "./book-renderer.js";

const API_ORIGIN = "https://localhost:7010/";
const bookId = new URLSearchParams(window.location.search).get("id");
const relatedBooks = document.getElementById("related-books");
const btnBorrowbook = document.getElementById("btnBorrowbook");

function getAuthorNames(book) {
    return book.authors?.map((author) => `${author.firstName} ${author.lastName}`).join(", ") || "Unknown author";
}

function setCover(book) {
    const cover = document.querySelector("[data-book-cover-initials]");
    if (!book.coverImage) {
        cover.textContent = book.title.split(" ").map((word) => word[0]).join("").slice(0, 3).toUpperCase();
        return;
    }

    const image = document.createElement("img");
    image.src = new URL(book.coverImage, API_ORIGIN).href;
    image.alt = `${book.title} cover`;
    cover.replaceWith(image);
    image.className = "book-detail__cover-image";
    image.style.width = "100%";
    image.style.height = "100%";
    image.style.objectFit = "cover";
    image.style.borderRadius = "inherit";
}

function renderBook(book) {
    document.title = book.title;
    document.querySelector("[data-book-breadcrumb]").textContent = book.title;
    document.querySelector("[data-book-title]").textContent = book.title;
    document.querySelector("[data-book-author]").textContent = getAuthorNames(book);
    document.querySelector("[data-book-description]").textContent = book.description || "No description available.";
    document.querySelector("[data-book-category]").textContent = book.categories?.[0]?.name || "Uncategorized";
    document.querySelector("[data-book-isbn]").textContent = book.isbn || "Not available";
    document.querySelector("[data-book-year]").textContent = book.publishYear || "Not available";
    document.querySelector("[data-book-total-copies]").textContent = book.copiesCount ?? book.totalCopies ?? "Not available";
    document.querySelector("[data-book-available-copies]").textContent = book.availableCopies ?? 0;

    const availability = document.querySelector("[data-book-availability]");
    availability.textContent = book.isAvailable ? "Available now" : "On loan";
    availability.className = `badge ${book.isAvailable ? "badge--success" : "badge--warning"}`;
    setCover(book);
    return book.categories?.[0]?.id;
}

async function showBorrowButton() {
    try {
        const user = await GetCurrentUser();
        if (["Member", "Admin"].includes(user?.role)) {
            document.querySelector("[data-book-actions]").hidden = false;
        }
    } catch (error) {
        console.debug("No authenticated borrowing role:", error);
    }
}

async function loadDetails() {
    if (!bookId) {
        throw new Error("A book id is required.");
    }

    const book = await GetBookByID(bookId);
    const categoryId = renderBook(book);
    await showBorrowButton();

    if (!categoryId) {
        relatedBooks.innerHTML = '<p class="book-detail__description">No related titles found.</p>';
        return;
    }

    const books = await ListBooksByCategorieForAnyone(categoryId);
    const related = (books ?? []).filter((relatedBook) => String(relatedBook.id) !== String(book.id));
    await renderBooks(relatedBooks, related);
    if (!related.length) {
        relatedBooks.innerHTML = '<p class="book-detail__description">No related titles found.</p>';
    }
}

btnBorrowbook.addEventListener("click", async () => {
    const now = new Date();
    try {
        btnBorrowbook.textContent = "Processing....";
        const Infome = await getMe();
        const Borrowbook = {memberId : Infome.id, bookId : bookId,borrowDate : new Date().toISOString()  };
        addBorrowing(Borrowbook).catch((error) => {alert(error);btnBorrowbook.textContent = "Failed";});
        btnBorrowbook.textContent = "Done";
    } catch (error) {
        console.error(error);
        alert("Failed to Borrow this Book Login or Sign up then Borrow This Book Again.");
        btnBorrowbook.textContent = "Failed";
        throw error;
    }
    
});
loadDetails().catch((error) => {
    document.querySelector("[data-book-title]").textContent = "Unable to load book";
    relatedBooks.innerHTML = '<p class="book-detail__description">Book details are unavailable.</p>';
    console.error("Unable to load book details:", error);
});
