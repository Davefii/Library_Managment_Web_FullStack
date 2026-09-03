import { getMe } from "../API_service_layer/Members.js";
import { getMember, getValue, renderError } from "./MemberDashboardHelpers.js";

const elements = {
    profileName: document.getElementById("profileName"),
    profileEmail: document.getElementById("profileEmail"),
    profilePhone: document.getElementById("profilePhone"),
    profileAddress: document.getElementById("profileAddress")
};

async function loadProfile() {
    const member = getMember(await getMe());
    elements.profileName.textContent = getValue(member, "name", "fullName") ?? "--";
    elements.profileEmail.textContent = getValue(getValue(member, "user"), "email") ?? "--";
    elements.profilePhone.textContent = getValue(member, "phone") ?? "--";
    elements.profileAddress.textContent = getValue(member, "address") ?? "--";
}

document.getElementById("editProfileButton")?.addEventListener("click", () => {
    const formUrl = "ProfileForm.html";
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
