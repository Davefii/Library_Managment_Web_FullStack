import * as BorrowingService from "../../API_service_layer/Borrowings.js";
import {
  attachTableActionHandler,
  formatDate,
  renderTableRows,
  showTableMessage,
} from "../SharedModules/TableRenderer.js";


const Searchbtn = document.getElementById("Searchbtn");
const statusFilter = document.getElementById("statusFilter");
const searchInput = document.getElementById("searchInput");
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

function getSelectedStatus() {
    const statusFilter = document.getElementById("statusFilter");
    return statusFilter ? statusFilter.value : "";
}
function getBorrowingStatus(borrowing) {
  if (borrowing.isReturned??borrowing.isreturned) return "Returned";
  if (new Date(borrowing.dueDate) < new Date()) return "Overdue";
  return "Active";
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

export async function loadBorrowings(status = getSelectedStatus()) {
  const tableBody = document.getElementById("borrowingsTableBody");
  if (!tableBody) {
    console.error("Table body not found: #borrowingsTableBody");
    return;
  }

  showTableMessage(tableBody, "Loading borrowings...", BORROWING_COLUMNS.length);

  try {
    const Borrowings = await BorrowingService.getBorrowings();

    let borrowings;
    if (status) {
        borrowings = await BorrowingService.getBorrowingsByStatus(status);
    } else {
        borrowings = await BorrowingService.getBorrowings();
    }

    if (!Array.isArray(Borrowings) || Borrowings.length === 0) {
      showTableMessage(tableBody, "No borrowing records found.", BORROWING_COLUMNS.length);
      return;
    }

    renderBorrowings(Borrowings);
  } catch (error) {
    console.error("Failed to load borrowings:", error);
    showTableMessage(
      tableBody,
      "Could not load borrowings. Please refresh the page.",
      BORROWING_COLUMNS.length,
    );
  }
}

function renderBorrowings(borrowings) {
  const tableBody = document.getElementById("borrowingsTableBody");
  renderTableRows(tableBody, borrowings, BORROWING_COLUMNS);
    attachTableActionHandler(tableBody, {
      return: handleReturnBorrowing,
      update: ({ id }) => OpenUpdateBorrow(id),
      delete: handleDeleteBorrowing,
    });
}



async function searchBorrowings() {
      const searchInput = document.getElementById("searchInput");
      const searchValue = searchInput.value.trim();
      const status = getSelectedStatus();
      const Bywhat = document.getElementById("Bywhat").value;

    if (!searchValue) {
        await loadBorrowings();
        return;
    }


    let borrowings = [];

    try {
      if (Bywhat === "Name") {
        borrowings =
            await BorrowingService.getBorrowingsByMemberName(searchValue);
      }
      else if (Bywhat === "UserName") {
          borrowings =
              await BorrowingService.getBorrowingsByUserEmail(searchValue);
      }
      else if (Bywhat === "BookTitle") {
          borrowings =
              await BorrowingService.getBorrowingsByBookTitle(searchValue);
      }
      else
      {
        borrowings = await BorrowingService.getBorrowings();
      }
      if (status) {
            switch (status) {
              case "Active":
                borrowings =  await BorrowingService.getBorrowingsByStatus(status);
                break;
              case "Returned":
                borrowings =  await BorrowingService.getBorrowingsByStatus(status);
                break;
              case "Overdue":
                borrowings =  await BorrowingService.getBorrowingsByStatus(status);
                break;
              default:
                borrowings = await BorrowingService.getBorrowings();
                break;
            }
      }

        if (borrowings.length === 0) {
            const tableBody = document.getElementById("borrowingsTableBody");
            showTableMessage(tableBody, "No borrowing records match your search.", BORROWING_COLUMNS.length);
            return;
        }
          renderBorrowings(borrowings);
    } 
    catch (error)
    {
      console.error(error);
      const tableBody = document.getElementById("borrowingsTableBody");
      showTableMessage(tableBody, "Search failed. Please try again.", BORROWING_COLUMNS.length);
    }
}

if (statusFilter) {
    statusFilter.addEventListener("change", () => {
        // Optionally clear search input to avoid confusion
        // document.getElementById("searchInput").value = "";
        loadBorrowings(); // uses the new status
    });
}
Searchbtn.addEventListener("click", searchBorrowings);
searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault(); // prevent form submission if any
                searchBorrowings();
            }
        });
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("createBorrowingButton")?.addEventListener("click", OpenAddBorrow);
  loadBorrowings();
});
