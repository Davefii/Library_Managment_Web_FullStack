import { getMe } from "../API_service_layer/Members.js";
import { formatDate, getMember, getValue, renderError } from "./MemberDashboardHelpers.js";

const membershipStatus = document.getElementById("membershipStatus");
const membershipExpiry = document.getElementById("membershipExpiry");

async function loadMembership() {
    const member = getMember(await getMe());
    membershipStatus.textContent = getValue(member, "isActive") ? "Active" : "Inactive";
    membershipExpiry.textContent = formatDate(getValue(member, "membershipExpiryDate"));
}

loadMembership().catch(renderError);
