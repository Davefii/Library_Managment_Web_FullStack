import { getRecentBorrowingsForMemberById } from "../API_service_layer/Borrowings.js";
import { getMe } from "../API_service_layer/Members.js";
import { getList, renderBorrowingsTable, renderError } from "./MemberDashboardHelpers.js";

const table = document.getElementById("recentBorrowingsTable");

async function loadRecentActivity() {
    const member = await getMe();
    const response = await getRecentBorrowingsForMemberById(member.id);
    renderBorrowingsTable(table, getList(response), "No recent borrowings.", "returnDate");
}

loadRecentActivity().catch(renderError);
