import * as Books from "../../API_service_layer/Books.js";
import {
  attachTableActionHandler,
  renderTableRows,
  showTableMessage,
} from "../SharedModules/TableRenderer.js";

let allBooks = [];

function getAuthorNames(book) {
  const authors = book.authors ?? book.Authors ?? [];
  const names = authors
    .map((author) => `${author.firstName ?? author.FirstName ?? ""} ${author.lastName ?? author.LastName ?? ""}`.trim())
    .filter(Boolean);

  return names.join(", ") || book.authorName || book.AuthorName || "-";
}

function getCategoryNames(book) {
  const categories = book.categories ?? book.Categories ?? [];
  const names = categories
    .map((category) => category.name ?? category.Name)
    .filter(Boolean);

  return names.join(", ") || book.categoryName || book.CategoryName || "-";
}

function createBookCover(book) {
  const imagePath = book.coverImage ?? book.CoverImage;
  if (!imagePath) return "-";

  const image = document.createElement("img");
  image.src = `https://localhost:7010/${imagePath}`;
  image.alt = `${book.title ?? book.Title ?? "Book"} cover`;
  image.width = 40;
  image.height = 56;
  image.style.objectFit = "cover";
  return image;
}

function createBookActions(book) {
  const bookId = book.id ?? book.ID;
  const actions = document.createElement("div");
  actions.className = "actions";

  for (const [action, label, className] of [
    ["update", "Update", "button button--small"],
    ["delete", "Delete", "button button--small button--danger"],
  ]) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.dataset.action = action;
    button.dataset.id = bookId;
    button.textContent = label;
    actions.append(button);
  }

  return actions;
}

const BOOK_COLUMNS = [
  { value: (book) => book.id ?? book.ID },
  { render: createBookCover },
  { value: (book) => book.title ?? book.Title },
  { value: (book) => book.isbn ?? book.ISBN },
  { value: getAuthorNames },
  { value: getCategoryNames },
  { value: (book) => book.copiesCount ?? book.totalCopies ?? book.TotalCopies },
  { value: (book) => book.publishYear ?? book.PublishYear },
  {
    render: (book) => {
      const isAvailable = book.isAvailable ?? book.IsAvailable;
      const badge = document.createElement("span");
      badge.className = `badge ${isAvailable ? "badge--success" : "badge--danger"}`;
      badge.textContent = isAvailable ? "Available" : "Unavailable";
      return badge;
    },
  },
  { render: createBookActions },
];

function OpenAddBook() {
  const url = new URL("BookForm.html", document.baseURI);
  window.open(url.href, "_blank", "width=1000,height=800,resizable=no,scrollbars=yes");
}

function OpenUpdateBook(bookId) {
  const url = new URL(`BookForm.html?id=${bookId}`, document.baseURI);
  window.open(url.href, "_blank", "width=1000,height=800,resizable=no,scrollbars=yes");
}

async function handleDeleteBook({ id, button }) {
  if (!window.confirm("Are you sure you want to delete this book?")) return;

  try {
    button.disabled = true;
    button.textContent = "Deleting...";
    await Books.deleteBook(id);
    await LoadBooks();
  } catch (error) {
    console.error("Failed to delete book:", error);
    alert(`Failed to delete book: ${error.message}`);
    button.disabled = false;
    button.textContent = "Delete";
  }
}

export async function LoadBooks() {
  const tableBody = document.getElementById("booksTableBody");
  if (!tableBody) {
    console.error("Table body not found: #booksTableBody");
    return;
  }

  showTableMessage(tableBody, "Loading books...", BOOK_COLUMNS.length);

  try {
    allBooks = await Books.BooksList();

    if (!Array.isArray(allBooks) || allBooks.length === 0) {
      showTableMessage(tableBody, "No books found.", BOOK_COLUMNS.length);
      return;
    }

    renderBooks(allBooks);
  } catch (error) {
    console.error("Failed to load books:", error);
    showTableMessage(tableBody, "Could not load books. Please refresh the page.", BOOK_COLUMNS.length);
  }
}

function renderBooks(books) {
  const tableBody = document.getElementById("booksTableBody");
  renderTableRows(tableBody, books, BOOK_COLUMNS);
  attachTableActionHandler(tableBody, {
    update: ({ id }) => OpenUpdateBook(id),
    delete: handleDeleteBook,
  });
}

function SearchBook() {
  const tableBody = document.getElementById("booksTableBody");
  const searchInput = document.getElementById("searchInput");
  const byWhat = document.getElementById("ByWhat");
  const searchValue = searchInput.value.trim().toLowerCase();

  if (!searchValue) {
    renderBooks(allBooks);
    return;
  }

  const books = allBooks.filter((book) => {
    const value = byWhat.value === "isbn"
      ? book.isbn ?? book.ISBN ?? ""
      : book.title ?? book.Title ?? "";
      return String(value).toLowerCase().includes(searchValue);
  });
  
  if (!books.length) {
    showTableMessage(tableBody, "No books found.", BOOK_COLUMNS.length);
    return;
  }

  renderBooks(books);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchBook")?.addEventListener("click", SearchBook);
  document.getElementById("searchInput")?.addEventListener("input", SearchBook);
  document.getElementById("ByWhat")?.addEventListener("change", SearchBook);
  document.getElementById("createBook")?.addEventListener("click", OpenAddBook);
  LoadBooks();
});
