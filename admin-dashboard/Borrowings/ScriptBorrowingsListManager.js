import * as BorrowingService from "../../API_service_layer/Borrowings.js";
import {
  attachTableActionHandler,
  formatDate,
  renderTableRows,
  showTableMessage,
} from "../SharedModules/TableRenderer.js";

function createButton(action, label, className, borrowingId) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.dataset.action = action;
  button.dataset.id = borrowingId;
  button.textContent = label;
  return button;
}

function createBorrowingStatus(borrowing) {
  const badge = document.createElement("span");

  if (borrowing.isReturned) {
    badge.className = "badge badge--success";
    badge.textContent = "Returned";
  } else if (new Date(borrowing.dueDate) < new Date()) {
    badge.className = "badge badge--danger";
    badge.textContent = "Overdue";
  } else {
    badge.className = "badge badge--warning";
    badge.textContent = "Borrowed";
  }

  return badge;
}

function createBorrowingActions(borrowing) {
  if (borrowing.isReturned) {
    const completedBadge = document.createElement("span");
    completedBadge.className = "badge badge--neutral";
    completedBadge.textContent = "Completed";
    return completedBadge;
  }

  const actions = document.createElement("div");
  actions.className = "actions";
  actions.append(
    createButton("return", "Return", "button button--small button--primary", borrowing.id),
    createButton("update", "Update", "button button--small", borrowing.id),
    createButton("delete", "Delete", "button button--small button--danger", borrowing.id),
  );
  return actions;
}

const BORROWING_COLUMNS = [
  { value: (borrowing) => borrowing.id },
  { value: (borrowing) => borrowing.member?.name },
  { value: (borrowing) => borrowing.user?.email },
  { value: (borrowing) => borrowing.book?.title },
  { value: (borrowing) => formatDate(borrowing.borrowDate) },
  { value: (borrowing) => formatDate(borrowing.dueDate) },
  { value: (borrowing) => formatDate(borrowing.returnDate) },
  { render: createBorrowingStatus },
  { render: createBorrowingActions },
];

function OpenAddBorrow() {
  const url = new URL("BorrowBookForm.html", document.baseURI);
  window.open(url.href, "_blank", "width=900,height=500,resizable=no,scrollbars=yes");
}

function OpenUpdateBorrow(borrowId) {
  const url = new URL(`BorrowBookForm.html?id=${borrowId}`, document.baseURI);
  window.open(url.href, "_blank", "width=900,height=500,resizable=no,scrollbars=yes");
}

async function handleReturnBorrowing({ id, button }) {
  if (!window.confirm(`Are you sure you want to mark borrowing #${id} as returned?`)) return;

  try {
    button.disabled = true;
    button.textContent = "Processing...";
    await BorrowingService.returnBook(id);
    await loadBorrowings();
  } catch (error) {
    console.error("Failed to return borrowing:", error);
    alert(`Could not return borrowing: ${error.message}`);
    button.disabled = false;
    button.textContent = "Return";
  }
}

async function handleDeleteBorrowing({ id, button }) {
  if (!window.confirm(`Are you sure you want to delete borrowing #${id}?`)) return;

  try {
    button.disabled = true;
    button.textContent = "Deleting...";
    await BorrowingService.deleteBorrowing(id);
    await loadBorrowings();
  } catch (error) {
    console.error("Failed to delete borrowing:", error);
    alert(`Could not delete borrowing: ${error.message}`);
    button.disabled = false;
    button.textContent = "Delete";
  }
}

export async function loadBorrowings() {
  const tableBody = document.getElementById("borrowingsTableBody");
  if (!tableBody) {
    console.error("Table body not found: #borrowingsTableBody");
    return;
  }

  showTableMessage(tableBody, "Loading borrowings...", BORROWING_COLUMNS.length);

  try {
    const borrowings = await BorrowingService.getBorrowings();

    if (!Array.isArray(borrowings) || borrowings.length === 0) {
      showTableMessage(tableBody, "No borrowing records found.", BORROWING_COLUMNS.length);
      return;
    }

    renderTableRows(tableBody, borrowings, BORROWING_COLUMNS);
    attachTableActionHandler(tableBody, {
      return: handleReturnBorrowing,
      update: ({ id }) => OpenUpdateBorrow(id),
      delete: handleDeleteBorrowing,
    });
  } catch (error) {
    console.error("Failed to load borrowings:", error);
    showTableMessage(
      tableBody,
      "Could not load borrowings. Please refresh the page.",
      BORROWING_COLUMNS.length,
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("createBorrowingButton")?.addEventListener("click", OpenAddBorrow);
  loadBorrowings();
});
