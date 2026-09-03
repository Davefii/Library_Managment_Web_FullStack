import { getMe, updateMyInformation } from "../API_service_layer/Members.js";
import { getMember, getValue } from "./MemberDashboardHelpers.js";

const form = document.getElementById("profile-form");
const saveButton = document.getElementById("save-profile-button");
const elements = {
    name: document.getElementById("profile-name"),
    phone: document.getElementById("profile-phone"),
    address: document.getElementById("profile-address"),
    membershipExpiryDate: document.getElementById("membership-expiry-date")
};

function formatDateForInput(dateValue) {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function closeForm() {
    if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: "member-saved" }, window.location.origin);
        window.close();
        return;
    }

    window.location.href = "Profile.html";
}

async function loadProfile() {
    const member = getMember(await getMe());
    elements.name.value = getValue(member, "name", "fullName") ?? "";
    elements.phone.value = getValue(member, "phone") ?? "";
    elements.address.value = getValue(member, "address") ?? "";
    elements.membershipExpiryDate.value = formatDateForInput(
        getValue(member, "membershipExpiryDate")
    );
}

async function saveProfile(event) {
    event.preventDefault();
    if (!form.reportValidity()) return;

    saveButton.disabled = true;
    saveButton.textContent = "Saving...";

    try {
        await updateMyInformation({
            name: elements.name.value.trim(),
            phone: elements.phone.value.trim(),
            address: elements.address.value.trim()
        });
        alert("Profile updated successfully.");
        closeForm();
    } catch (error) {
        alert(`Could not update profile: ${error.message}`);
        saveButton.disabled = false;
        saveButton.textContent = "Save changes";
    }
}

form.addEventListener("submit", saveProfile);
document.getElementById("cancel-profile-button").addEventListener("click", closeForm);
loadProfile().catch(error => alert(`Could not load profile: ${error.message}`));
