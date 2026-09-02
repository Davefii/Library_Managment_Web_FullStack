import { getAllUsers } from "../../API_service_layer/Users.js";
import {
  createUserProfile,
  getAllUserProfiles,
  getUserProfileById,
  updateUserProfile,
} from "../../API_service_layer/UsersProfile.js";

const UserProfileFormMode = Object.freeze({
  AddNew: 0,
  Update: 1,
});

const form = document.getElementById("user-profile-form");
const title = document.getElementById("user-profile-form-title");
const description = document.getElementById("user-profile-form-description");
const userSelect = document.getElementById("profile-user-id");
const saveButton = document.getElementById("save-user-profile-button");
const cancelButton = document.getElementById("cancel-user-profile-button");

const requestedProfileId = Number(new URLSearchParams(window.location.search).get("id"));
const hasValidProfileId = Number.isInteger(requestedProfileId) && requestedProfileId > 0;
const formMode = hasValidProfileId ? UserProfileFormMode.Update : UserProfileFormMode.AddNew;

function setSavingState(isSaving) {
  saveButton.disabled = isSaving;
  saveButton.textContent = isSaving
    ? formMode === UserProfileFormMode.AddNew ? "Saving..." : "Updating..."
    : formMode === UserProfileFormMode.AddNew ? "Save User Profile" : "Update User Profile";
}

function closeUserProfileForm() {
  if (window.opener && !window.opener.closed) {
    window.close();
    return;
  }

  window.location.href = "UserProfileManager.html";
}

function createUserOption(user) {
  const option = document.createElement("option");
  option.value = user.id;
  option.textContent = user.isActive ? user.email : `${user.email} — Inactive`;
  return option;
}

async function loadAvailableUsers(selectedUserId = null) {
  const [users, profiles] = await Promise.all([
    getAllUsers(),
    getAllUserProfiles(),
  ]);

  const existingProfileUserIds = new Set(profiles.map((profile) => profile.userId));
  const availableUsers = users.filter((user) => (
    !existingProfileUserIds.has(user.id) || user.id === selectedUserId
  ));

  userSelect.replaceChildren(new Option("Select a user", ""));
  for (const user of availableUsers) {
    userSelect.append(createUserOption(user));
  }

  if (selectedUserId) {
    userSelect.value = String(selectedUserId);
  }
}

export async function LoadDataUserProfileUpdateMode(profileId) {
  setSavingState(true);

  try {
    const profile = await getUserProfileById(profileId);
    await loadAvailableUsers(profile.userId);

    userSelect.disabled = true;
    document.getElementById("profile-first-name").value = profile.firstName ?? "";
    document.getElementById("profile-last-name").value = profile.lastName ?? "";
    document.getElementById("profile-phone-number").value = profile.phoneNumber ?? "";
    document.getElementById("profile-address").value = profile.address ?? "";
  } catch (error) {
    console.error("Failed to load user profile:", error);
    alert(`Could not load user profile: ${error.message}`);
    closeUserProfileForm();
  } finally {
    setSavingState(false);
  }
}

async function saveUserProfile(event) {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const profile = {
    firstName: document.getElementById("profile-first-name").value.trim(),
    lastName: document.getElementById("profile-last-name").value.trim(),
    phoneNumber: document.getElementById("profile-phone-number").value.trim() || null,
    address: document.getElementById("profile-address").value.trim() || null,
  };

  if (formMode === UserProfileFormMode.AddNew) {
    profile.userId = Number(userSelect.value);
  }

  setSavingState(true);

  try {
    if (formMode === UserProfileFormMode.AddNew) {
      await createUserProfile(profile);
    } else {
      await updateUserProfile(requestedProfileId, profile);
    }

    window.opener?.postMessage({ type: "user-profile-saved" }, window.location.origin);
    alert(formMode === UserProfileFormMode.AddNew ? "User profile saved successfully." : "User profile updated successfully.");
    closeUserProfileForm();
  } catch (error) {
    console.error("Failed to save user profile:", error);
    alert(`Could not save user profile: ${error.message}`);
    setSavingState(false);
  }
}

function initializeUserProfileForm() {
  if (!form || !title || !description || !userSelect || !saveButton || !cancelButton) {
    console.error("User profile form elements are missing.");
    return;
  }

  if (formMode === UserProfileFormMode.Update) {
    title.textContent = "Update User Profile";
    description.textContent = "Edit this user profile.";
    LoadDataUserProfileUpdateMode(requestedProfileId);
  } else {
    loadAvailableUsers().catch((error) => {
      console.error("Failed to load available users:", error);
      userSelect.replaceChildren(new Option("Could not load users", ""));
    });
  }

  form.addEventListener("submit", saveUserProfile);
  cancelButton.addEventListener("click", (event) => {
    event.preventDefault();
    closeUserProfileForm();
  });
}

document.addEventListener("DOMContentLoaded", initializeUserProfileForm);
