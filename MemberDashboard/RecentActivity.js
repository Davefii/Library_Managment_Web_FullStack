import { getRecentBorrowingsForMember } from "../API_service_layer/Borrowings.js";
import { getList, renderBorrowingsTable, renderError } from "./MemberDashboardHelpers.js";

const table = document.getElementById("recentBorrowingsTable");

async function loadRecentActivity() {
    const response = await getRecentBorrowingsForMember();
    renderBorrowingsTable(table, getList(response), "No recent borrowings.", "returnDate");
}

loadRecentActivity().catch(renderError);
