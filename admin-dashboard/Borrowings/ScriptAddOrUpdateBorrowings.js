// ============================================
// IMPORTS - API Service Layer
// ============================================
import * as BookService from "../../API_service_layer/Books.js";
import * as MemberService from "../../API_service_layer/Memebers.js";
import * as BorrowingService from "../../API_service_layer/Borrowings.js";

// ============================================
// CONSTANTS & STATE
// ============================================
const MODE = {
    ADD: 0,
    UPDATE: 1
};

let currentMode = MODE.ADD;
let currentBorrowingId = null;

// DOM Elements
const form = document.getElementById('borrowingForm');
const bookSelect = document.getElementById('bookId');
const memberSelect = document.getElementById('memberId');
const BorrowDateInput = document.getElementById('BorrowDate');
const formTitle = document.getElementById('formTitle');
const btnSave = document.getElementById('btnSave');
const btnClose = document.getElementById('btnClose');

// ============================================
// 1. DETECT MODE FROM URL
// ============================================
function detectMode() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
        currentMode = MODE.UPDATE;
        currentBorrowingId = parseInt(id, 10);
        formTitle.textContent = 'Edit borrowing record.';
        btnSave.textContent = 'Update Borrowing';
    } else {
        currentMode = MODE.ADD;
        currentBorrowingId = null;
        formTitle.textContent = 'Assign a book to a member.';
        btnSave.textContent = 'Create Borrowing';
    }
}

// ============================================
// 2. LOAD DROPDOWNS (Books & Members)
// ============================================
async function loadDropdowns() {
    try {
        // Load Books
        const books = await BookService.BooksList();
        bookSelect.innerHTML = '<option value="">-- Select a book --</option>';
        
        // Optional: Filter to only show books with available copies > 0
        const availableBooks = books.filter(book => book.availableCopies > 0);
        
        availableBooks.forEach(book => {
            const option = document.createElement('option');
            option.value = book.id;
            option.textContent = `${book.title} (${book.availableCopies} available)`;
            bookSelect.appendChild(option);
        });

        // Load Members
        const members = await MemberService.getMembers();
        memberSelect.innerHTML = '<option value="">-- Select a member --</option>';
        
        // Optional: Filter to only show active members
        const activeMembers = members.filter(member => member.isActive === true);
        
        activeMembers.forEach(member => {
            const option = document.createElement('option');
            option.value = member.id;
            option.textContent = member.name || member.user?.email || `Member #${member.id}`;
            memberSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Failed to load dropdowns:', error);
        alert('Error loading books or members. Please refresh the page.');
    }
}

// ============================================
// 3. LOAD BORROWING DATA FOR UPDATE MODE
// ============================================
async function loadBorrowingData() {
    if (!currentBorrowingId) return;

    try {
        const borrowing = await BorrowingService.getBorrowingById(currentBorrowingId);
        
        // Populate form fields
        bookSelect.value = borrowing.bookId || '';
        memberSelect.value = borrowing.memberId || '';
        
        // Format date for input[type="date"] (YYYY-MM-DD)
        if (borrowing.dueDate) {
            const dueDate = new Date(borrowing.dueDate);
            const year = dueDate.getFullYear();
            const month = String(dueDate.getMonth() + 1).padStart(2, '0');
            const day = String(dueDate.getDate()).padStart(2, '0');
            BorrowDateInput.value = `${year}-${month}-${day}`;
        }

    } catch (error) {
        console.error('Failed to load borrowing data:', error);
        alert(`Error loading borrowing #${currentBorrowingId}. Please refresh the page.`);
    }
}

// ============================================
// 4. COLLECT FORM DATA
// ============================================
function collectFormData() {
    const bookId = Number(bookSelect.value);
    const memberId = Number(memberSelect.value);
    const borrowDate = new Date().toISOString();
    if (!bookId) {
        alert('Please select a book.');
        return null;
    }

    if (!memberId) {
        alert('Please select a member.');
        return null;
    }

    return {
        MemberId: memberId,
        BookId: bookId,    
        BorrowDate: borrowDate
    };
}

// ============================================
// 5. ADD BORROWING
// ============================================
async function addBorrowing(data) {
    try {
        const result = await BorrowingService.addBorrowing(data);
        
        alert('✅ Borrowing created successfully!');
        
        // Switch to Update Mode with the new ID
        currentMode = MODE.UPDATE;
        currentBorrowingId = result.id; // Assuming the API returns { id: ... }
        formTitle.textContent = 'Edit borrowing record.';
        btnSave.textContent = 'Update Borrowing';
        
        // Reload data to populate the form with the new record
        await loadBorrowingData();
        
        // Update URL without reloading (optional: for bookmarking)
        const newUrl = `${window.location.pathname}?id=${currentBorrowingId}`;
        window.history.pushState({}, '', newUrl);
        
        return result;

    } catch (error) {
        console.error('Add borrowing error:', error);
        alert(`❌ Failed to create borrowing: ${error.message || 'Unknown error'}`);
        throw error;
    }
}

// ============================================
// 6. UPDATE BORROWING
// ============================================
async function updateBorrowing(data) {
    if (!currentBorrowingId) {
        alert('Error: No borrowing ID found for update.');
        return;
    }
    try {
        const result = await BorrowingService.updateBorrowing(currentBorrowingId, data);
        
        alert('✅ Borrowing updated successfully!');
        
        // Reload data to show fresh values
        await loadBorrowingData();
        
        return result;

    } catch (error) {
        console.error('Update borrowing error:', error);
        alert(`❌ Failed to update borrowing: ${error.message || 'Unknown error'}`);
        throw error;
    }
}

// ============================================
// 7. SAVE HANDLER (Routes to Add or Update)
// ============================================
async function handleSave(event) {
    event.preventDefault();

    // Collect and validate data
    const data = collectFormData();
    if (!data) return; // validation failed

    // Disable save button to prevent double submission
    btnSave.disabled = true;
    btnSave.textContent = 'Saving...';

    try {
        if (currentMode === MODE.ADD) {
            await addBorrowing(data);
            alert("Added Borrow Successfully");
        } else {
            await updateBorrowing(data);
            alert("Updated Borrow Successfully");
        }
    } catch (error) {
        console.error(error);
        
        // Error already handled in specific functions
        // But we re-throw to keep the catch block consistent
    } finally {
        // Re-enable save button
        btnSave.disabled = false;
        btnSave.textContent = currentMode === MODE.ADD ? 'Create Borrowing' : 'Update Borrowing';
    }
}

// ============================================
// 8. CANCEL / CLOSE
// ============================================
function handleClose() {
    window.close();
}

// ============================================
// 9. INITIALIZE
// ============================================
async function LoadData() {
    try {
        // Detect mode from URL
        detectMode();

        // Load dropdowns (Books & Members)
        await loadDropdowns();

        // If Update mode, load existing data
        if (currentMode === MODE.UPDATE) {
            await loadBorrowingData();
        }

        // Attach event listeners
        form.addEventListener('submit', handleSave);
        btnClose.addEventListener('click', handleClose);

    } catch (error) {
        console.error('Initialization error:', error);
        alert('Failed to initialize the form. Please refresh the page.');
    }
}

// ============================================
// 10. START
// ============================================
document.addEventListener("DOMContentLoaded",LoadData());