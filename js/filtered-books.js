import { ListBooksByAuthorForAnyone, ListBooksByCategorieForAnyone } from "../API_service_layer/Books.js";
import { renderBooks } from "./book-renderer.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const isAuthorPage = window.location.pathname.toLowerCase().includes("books-by-author");
const title = document.querySelector("[data-filter-title]");
const subtitle = document.querySelector("[data-filter-subtitle]");
const count = document.querySelector("[data-filter-count]");
const grid = document.getElementById("catalog-grid");

async function loadBooks() {
    if (!id) {
        throw new Error("A category or author id is required.");
    }

    const books = isAuthorPage
        ? await ListBooksByAuthorForAnyone(id)
        : await ListBooksByCategorieForAnyone(id);

    if (title) {
        title.textContent = isAuthorPage ? "Books by author" : "Books by category";
    }
    if (subtitle) {
        subtitle.textContent = `${books?.length ?? 0} ${(books?.length ?? 0) === 1 ? "title" : "titles"} in this collection`;
    }
    if (count) {
        count.textContent = `${books?.length ?? 0} results`;
    }
    await renderBooks(grid, books ?? []);

    if (!books?.length) {
        grid.innerHTML = '<p class="page-subtitle">No books were found.</p>';
    }
}

loadBooks().catch((error) => {
    grid.innerHTML = '<p class="page-subtitle">Unable to load books.</p>';
    console.error("Unable to load filtered books:", error);
});
