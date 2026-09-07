import { BooksListForAnyone,GetListBooksByTitle } from "../API_service_layer/Books.js";
import { renderBooks } from "./book-renderer.js";

const catalogGrid = document.getElementById("catalog-grid");
const SearchBookBox = document.getElementById("SearchBookBox");
const SearchBookBtn = document.getElementById("SearchBookBtn");
async function SearchBook() {
    const searchTerm = SearchBookBox.value.trim();
    if (!searchTerm) {
        await loadAllBooks();
        return;
    }
    try {
        const books = await GetListBooksByTitle(searchTerm);
        if (books && books.length > 0) {
            renderBooks(catalogGrid, books);
        } else {
            // No results found – show a friendly message
            catalogGrid.innerHTML = `<p class="no-results">No books found matching "${searchTerm}".</p>`;
        }
    } 
    catch (error) {
        console.error("Search error:", error);
        catalogGrid.innerHTML = `<p class="error">Search failed. Please try again later.</p>`;
    }
}
if (catalogGrid) {
    BooksListForAnyone()
        .then((books) => renderBooks(catalogGrid, books))
        .catch((error) => console.error("Unable to load catalog books:", error));
    if (SearchBookBtn) {SearchBookBtn.addEventListener("click", SearchBook);}
    // Optionally, press Enter in the search box triggers search
    if (SearchBookBox) {
        SearchBookBox.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault(); // prevent form submission if any
                SearchBook();
            }
        });
    }
    SearchBookBox.addEventListener("input", function() {
        if (this.value.trim() === "") {
              BooksListForAnyone()
        .then((books) => renderBooks(catalogGrid, books))
        .catch((error) => console.error("Unable to load catalog books:", error));
        }
      });
}