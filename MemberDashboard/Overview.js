import { getMe } from "../API_service_layer/Members.js";
import {
    getActiveBorrowingsForMember,
    getOverdueBorrowingsForMember,
    getReturnedBorrowingsForMember,
    getTotalBorrowingsForMember
} from "../API_service_layer/Borrowings.js";
import { getCount, getMember, formatDate, renderError, getValue } from "./MemberDashboardHelpers.js";

const elements = {
    memberName: document.getElementById("memberName"),
    membershipStatus: document.getElementById("membershipStatus"),
    membershipExpiry: document.getElementById("membershipExpiry"),
    totalBorrowings: document.getElementById("totalBorrowings"),
    activeBorrowings: document.getElementById("activeBorrowings"),
    returnedBooks: document.getElementById("returnedBooks"),
    overdueBooks: document.getElementById("overdueBooks")
};

async function loadOverview() {
    const [memberResponse, totalResponse, activeResponse, returnedResponse, overdueResponse] = await Promise.all([
        getMe(),
        getTotalBorrowingsForMember(),
        getActiveBorrowingsForMember(),
        getReturnedBorrowingsForMember(),
        getOverdueBorrowingsForMember()
    ]);
    const member = getMember(memberResponse);

    elements.memberName.textContent = getValue(member, "name", "fullName") ?? "Member";
    elements.membershipStatus.textContent = getValue(member, "isActive") ? "Active" : "Inactive";
    elements.membershipExpiry.textContent = formatDate(getValue(member, "membershipExpiryDate"));
    elements.totalBorrowings.textContent = getCount(totalResponse);
    elements.activeBorrowings.textContent = getCount(activeResponse);
    elements.returnedBooks.textContent = getCount(returnedResponse);
    elements.overdueBooks.textContent = getCount(overdueResponse);
}

loadOverview().catch(renderError);
