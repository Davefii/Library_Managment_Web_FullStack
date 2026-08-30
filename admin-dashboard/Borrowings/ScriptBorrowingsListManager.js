// BorrowingsList.js (or your page's main script)
import * as BorrowingService from "../../API_service_layer/Borrowings.js";

const btnBorrowbook = document.getElementById("createBorrowingButton");

function OpenAddBorrow() {
    const url = new URL(`BorrowBookForm.html`, document.baseURI);
    window.open(url.href,  "_blank",
        "width=900,height=500,resizable=no,scrollbars=yes"
    );
}
function OpenUpdateBorrow(borrowId) {
        const url = new URL(
        `BorrowBookForm.html?id=${borrowId}`,
        document.baseURI
    );
    window.open(url.href,  "_blank",
        "width=900,height=500,resizable=no,scrollbars=yes"
    );
}
btnBorrowbook.addEventListener("click", OpenAddBorrow);
export async function loadBorrowings() {
    const tbody = document.getElementById('borrowingsTableBody');
    if (!tbody) {
        console.error('Table body not found: #borrowingsTableBody');
        return;
    }

    // --- 1. Show loading state ---
    tbody.innerHTML = `
        <tr>
            <td colspan="9" class="empty-state">Loading borrowings...</td>
        </tr>
    `;

    try {
        // --- 2. Fetch data using your existing service ---
        // Assuming BorrowingService.getBorrowings() returns the array directly.
        const borrowings = await BorrowingService.getBorrowings();

        // --- 3. Handle empty state ---
        if (!borrowings || borrowings.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="empty-state">No borrowing records found.</td>
                </tr>
            `;
            return;
        }

        // --- 4. Generate table rows ---
        const rows = borrowings.map(borrowing => {
            // Format dates for display (using locale string)
            const borrowDate = borrowing.borrowDate 
                ? new Date(borrowing.borrowDate).toLocaleDateString('en-GB', {day: '2-digit',month: '2-digit',year: 'numeric'}) 
                : '-';
            const dueDate = borrowing.dueDate 
                ? new Date(borrowing.dueDate).toLocaleDateString('en-GB', {day: '2-digit',month: '2-digit',year: 'numeric'}) 
                : '-';
            const returnDate = borrowing.returnDate 
                ? new Date(borrowing.returnDate).toLocaleDateString('en-GB', {day: '2-digit',month: '2-digit',year: 'numeric'}) 
                : '-';

            // --- Status Badge Logic ---
            let statusBadge = '';
            if (borrowing.isReturned) {
                statusBadge = `<span class="badge badge--success">Returned</span>`;
            } else {
                // Check if overdue (optional, but adds professional polish)
                const today = new Date();
                const due = new Date(borrowing.dueDate);
                if (due < today) {
                    statusBadge = `<span class="badge badge--danger">Overdue</span>`;
                } else {
                    statusBadge = `<span class="badge badge--warning">Borrowed</span>`;
                }
            }

            // --- Action Buttons ---
            // 1. Update Button (always visible, links to edit form)
            const updateButton = `<button href="#" class="button button--small" data-action="update" data-id="${borrowing.id}">Update</button>`;

            // "Return" button appears only if NOT returned.
            const returnButton = `<button class="button button--small button--primary" data-action="return" data-id="${borrowing.id}">Return</button>`;

            // "Delete" button always appears.
            const deleteButton = `<button class="button button--small button--danger" data-action="delete" data-id="${borrowing.id}">Delete</button>`;

            const actionsHtml = !borrowing.isReturned ? `${returnButton} ${updateButton} ${deleteButton}` : `<span class="badge badge--neutral">Completed</span>`;

            return `
                <tr data-id="${borrowing.id}">
                    <td>${borrowing.id}</td>
                    <td>${borrowing.member?.name || 'N/A'}</td>
                    <td>${borrowing.user?.email || 'N/A'}</td>
                    <td>${borrowing.book?.title || 'N/A'}</td>
                    <td>${borrowDate}</td>
                    <td>${dueDate}</td>
                    <td>${returnDate}</td>
                    <td>${statusBadge}</td>
                    <td>${actionsHtml}</td>
                </tr>
            `;
        });

        // --- 5. Inject rows into tbody ---
        tbody.innerHTML = rows.join('');

        // --- 6. Attach event listeners to the action buttons ---
        attachActionHandlers(tbody);


    } catch (error) {
        console.error('Failed to load borrowings:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="empty-state" style="color: var(--color-danger);">
                    ⚠️ Error loading borrowings. Please refresh the page.
                </td>
            </tr>
        `;
    }
}

// --- The rest (attachActionHandlers) remains exactly the same ---
function attachActionHandlers(tbody) {
    if (tbody._delegateAttached) return;
    tbody._delegateAttached = true;

    tbody.addEventListener('click', async function (event) {
        const target = event.target.closest('button');
        if (!target) return;

        const action = target.dataset.action;
        const id = target.dataset.id;

        if (!id) return;

        // --- Handle Return Action ---
        if (action === 'return') {
            const confirmed = confirm(`Are you sure you want to mark borrowing #${id} as returned?`);
            if (!confirmed) return;

            try {
                target.disabled = true;
                target.textContent = 'Processing...';

                // IMPORTANT: Replace this with YOUR service method if you have one.
                // Example: await BorrowingService.returnBorrowing(id);
                const response = await BorrowingService.returnBook(id);

                alert(`Borrowing #${id} returned successfully!`);
                await loadBorrowings();

            } catch (error) {
                console.error('Return error:', error);
                alert(`Error returning book: ${error.message}`);
                target.disabled = false;
                target.textContent = 'Return';
            }
        }

        // --- Handle Delete Action ---
        if (action === 'delete') {
            const confirmed = confirm(`⚠️ Are you sure you want to DELETE borrowing #${id}? This cannot be undone.`);
            if (!confirmed) return;

            try {
                // IMPORTANT: Replace this with YOUR service method if you have one.
                const BorrowingDelete = await BorrowingService.deleteBorrowing(id);

                alert(`Borrowing #${id} deleted successfully.`);
                await loadBorrowings();

            } catch (error) {
                console.error('Delete error:', error);
                alert(`Error deleting borrowing: ${error.message}`);
            }
        }
        if (action === 'update') {
            try {
                OpenUpdateBorrow(id);
            } catch (error) {
                alert(`Error Updating borrowing: ${error.message}`);
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", loadBorrowings());