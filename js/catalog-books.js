import { BooksListForAnyone } from "../API_service_layer/Books.js";
import { renderBooks } from "./book-renderer.js";

const catalogGrid = document.getElementById("catalog-grid");

if (catalogGrid) {
    BooksListForAnyone()
        .then((books) => renderBooks(catalogGrid, books))
        .catch((error) => console.error("Unable to load catalog books:", error));
}