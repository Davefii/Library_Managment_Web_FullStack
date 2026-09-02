import {
  addUser,
  getUserById,
  updateUser,
} from "../../API_service_layer/Users.js";

const UserFormMode = Object.freeze({
  AddNew: 0,
  Update: 1,
});

const form = document.getElementById("user-form");
const title = document.getElementById("user-form-title");
const description = document.getElementById("user-form-description");
const passwordInput = document.getElementById("user-password");
const saveButton = document.getElementById("save-user-button");
const cancelButton = document.getElementById("cancel-user-button");

const requestedUserId = Number(new URLSearchParams(window.location.search).get("id"));
const hasValidUserId = Number.isInteger(requestedUserId) && requestedUserId > 0;
const formMode = hasValidUserId ? UserFormMode.Update : UserFormMode.AddNew;

function setSavingState(isSaving) {
  saveButton.disabled = isSaving;
  saveButton.textContent = isSaving
    ? formMode === UserFormMode.AddNew ? "Saving..." : "Updating..."
    : formMode === UserFormMode.AddNew ? "Save User" : "Update User";
}

function closeUserForm() {
  if (window.opener && !window.opener.closed) {
    window.close();
    return;
  }

  window.location.href = "Users.html";
}

export async function loadUserForUpdateMode(userId) {
  setSavingState(true);

  try {
    const user = await getUserById(userId);
    document.getElementById("user-email").value = user.email ?? "";
    document.getElementById("user-role").value = user.role ?? "Member";
    document.getElementById("user-is-active").checked = Boolean(user.isActive);
  } catch (error) {
    console.error("Failed to load user:", error);
    alert(`Could not load user details: ${error.message}`);
    closeUserForm();
  } finally {
    setSavingState(false);
  }
}

async function saveUser(event) {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const password = passwordInput.value;
  const user = {
    email: document.getElementById("user-email").value.trim(),
    role: document.getElementById("user-role").value,
    isActive: document.getElementById("user-is-active").checked,
  };

  if (formMode === UserFormMode.AddNew || password) {
    user.password = password;
  }

  setSavingState(true);

  try {
    if (formMode === UserFormMode.AddNew) {
      await addUser(user);
    } else {
      await updateUser(requestedUserId, user);
    }

    window.opener?.postMessage({ type: "user-saved" }, window.location.origin);
    alert(formMode === UserFormMode.AddNew ? "User saved successfully." : "User updated successfully.");
    closeUserForm();
  } catch (error) {
    console.error("Failed to save user:", error);
    alert(`Could not save user: ${error.message}`);
    setSavingState(false);
  }
}

function initializeUserForm() {
  if (!form || !title || !description || !passwordInput || !saveButton || !cancelButton) {
    console.error("User form elements are missing.");
    return;
  }

  if (formMode === UserFormMode.Update) {
    title.textContent = "Update User";
    description.textContent = "Edit this application user.";
    passwordInput.required = false;
    passwordInput.placeholder = "Leave blank to keep the current password";
    loadUserForUpdateMode(requestedUserId);
  }

  form.addEventListener("submit", saveUser);
  cancelButton.addEventListener("click", (event) => {
    event.preventDefault();
    closeUserForm();
  });
}

document.addEventListener("DOMContentLoaded", initializeUserForm);
