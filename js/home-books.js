import { PapularBooksListForAnyone } from "../API_service_layer/Books.js";
import { renderBooks } from "./book-renderer.js";

const popularBooks = document.getElementById("popular-books");

if (popularBooks) {
    PapularBooksListForAnyone()
        .then((books) => renderBooks(popularBooks, books))
        .catch((error) => console.error("Unable to load popular books:", error));
}