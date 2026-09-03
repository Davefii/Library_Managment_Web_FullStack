import { getActiveBorrowingsForMember } from "../API_service_layer/Borrowings.js";
import { getList, renderBorrowingsTable, renderError } from "./MemberDashboardHelpers.js";

const table = document.getElementById("currentBorrowingsTable");

async function loadCurrentlyBorrowed() {
    const response = await getActiveBorrowingsForMember();
    renderBorrowingsTable(table, getList(response), "No active borrowings.", "dueDate");
}

loadCurrentlyBorrowed().catch(renderError);
