import {
  addMember,
  getMemberByID,
  updateMember,
} from "../../API_service_layer/Members.js";

const MemberFormMode = Object.freeze({
  AddNew: 0,
  Update: 1,
});

const form = document.getElementById("member-registration-form");
const title = document.getElementById("member-form-title");
const description = document.getElementById("member-form-description");
const saveButton = document.getElementById("save-member-button");
const cancelButton = document.getElementById("cancel-member-button");

const requestedMemberId = Number(new URLSearchParams(window.location.search).get("id"));
const hasValidMemberId = Number.isInteger(requestedMemberId) && requestedMemberId > 0;
const formMode = hasValidMemberId ? MemberFormMode.Update : MemberFormMode.AddNew;

function formatDateForInput(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function setSavingState(isSaving) {
  saveButton.disabled = isSaving;
  cancelButton.setAttribute("aria-disabled", String(isSaving));
  saveButton.textContent = isSaving
    ? formMode === MemberFormMode.AddNew ? "Saving..." : "Updating..."
    : formMode === MemberFormMode.AddNew ? "Save Member" : "Update Member";
}

function closeMemberForm() {
  if (window.opener && !window.opener.closed) {
    window.close();
    return;
  }

  window.location.href = "Members.html";
}

export async function LoadDataMemberUpdateMode(memberId) {
  setSavingState(true);

  try {
    const member = await getMemberByID(memberId);
    document.getElementById("member-full-name").value = member.name ?? "";
    document.getElementById("member-phone-number").value = member.phone ?? "";
    document.getElementById("member-address").value = member.address ?? "";
    document.getElementById("membership-expiry-date").value = formatDateForInput(member.membershipExpiryDate);
  } catch (error) {
    console.error("Failed to load member:", error);
    alert(`Could not load member details: ${error.message}`);
    closeMemberForm();
  } finally {
    setSavingState(false);
  }
}

async function saveMember(event) {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const member = {
    name: document.getElementById("member-full-name").value.trim(),
    phone: document.getElementById("member-phone-number").value.trim(),
    address: document.getElementById("member-address").value.trim(),
    membershipExpiryDate: document.getElementById("membership-expiry-date").value,
  };

  setSavingState(true);

  try {
    if (formMode === MemberFormMode.AddNew) {
      await addMember(member);
    } else {
      await updateMember(requestedMemberId, member);
    }

    window.opener?.postMessage({ type: "member-saved" }, window.location.origin);
    alert(formMode === MemberFormMode.AddNew ? "Member saved successfully." : "Member updated successfully.");
    closeMemberForm();
  } catch (error) {
    console.error("Failed to save member:", error);
    alert(`Could not save member: ${error.message}`);
    setSavingState(false);
  }
}

function initializeMemberForm() {
  if (!form || !title || !description || !saveButton || !cancelButton) {
    console.error("Member form elements are missing.");
    return;
  }

  if (formMode === MemberFormMode.Update) {
    title.textContent = "Update Member";
    description.textContent = "Edit this member profile.";
    LoadDataMemberUpdateMode(requestedMemberId);
  }

  form.addEventListener("submit", saveMember);
  cancelButton.addEventListener("click", (event) => {
    event.preventDefault();
    closeMemberForm();
  });
}

document.addEventListener("DOMContentLoaded", initializeMemberForm);
