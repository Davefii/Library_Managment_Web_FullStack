import { getMe } from "../API_service_layer/Members.js";
import { getMember, getValue, renderError } from "./MemberDashboardHelpers.js";

const elements = {
    profileName: document.getElementById("profileName"),
    profileEmail: document.getElementById("profileEmail"),
    profilePhone: document.getElementById("profilePhone"),
    profileAddress: document.getElementById("profileAddress")
};

let currentMemberId;

async function loadProfile() {
    const member = getMember(await getMe());
    currentMemberId = getValue(member, "id", "memberId", "memberID");
    elements.profileName.textContent = getValue(member, "name", "fullName") ?? "--";
    elements.profileEmail.textContent = getValue(member, "email") ?? "--";
    elements.profilePhone.textContent = getValue(member, "phone") ?? "--";
    elements.profileAddress.textContent = getValue(member, "address") ?? "--";
}

document.getElementById("editProfileButton")?.addEventListener("click", () => {
    if (!currentMemberId) {
        alert("Member information is still loading. Please try again.");
        return;
    }

    const formUrl = `../admin-dashboard/Members/MemberFrom.html?id=${encodeURIComponent(currentMemberId)}`;
    const editWindow = window.open(
        formUrl,
        "MemberEditWindow",
        "width=720,height=720,resizable=yes,scrollbars=yes"
    );

    if (!editWindow) {
        alert("Please allow pop-ups to open the member edit form.");
    }
});

window.addEventListener("message", event => {
    if (event.origin !== window.location.origin || event.data?.type !== "member-saved") return;
    loadProfile().catch(renderError);
});

loadProfile().catch(renderError);
