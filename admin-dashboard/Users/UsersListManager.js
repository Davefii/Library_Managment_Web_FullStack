import {
  deleteUser,
  getAllUsers,
} from "../../API_service_layer/Users.js";
import {
  attachTableActionHandler,
  formatDate,
  renderTableRows,
  showTableMessage,
} from "../SharedModules/TableRenderer.js";

function createUserActions(user) {
  const actions = document.createElement("div");
  actions.className = "actions";

  for (const [action, label, className] of [
    ["update", "Update", "button button--small"],
    ["delete", "Delete", "button button--small button--danger"],
  ]) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.dataset.action = action;
    button.dataset.id = user.id;
    button.textContent = label;
    actions.append(button);
  }

  return actions;
}

const USER_COLUMNS = [
  { value: (user) => user.email },
  { value: (user) => user.role },
  {
    render: (user) => {
      const badge = document.createElement("span");
      badge.className = `badge ${user.isActive ? "badge--success" : "badge--danger"}`;
      badge.textContent = user.isActive ? "Active" : "Inactive";
      return badge;
    },
  },
  { value: (user) => formatDate(user.createdAt) },
  { render: createUserActions },
];

function openUserForm(userId) {
  const formUrl = userId
    ? `UserForm.html?id=${encodeURIComponent(userId)}`
    : "UserForm.html";
  const popup = window.open(
    new URL(formUrl, document.baseURI).href,
    "userForm",
    "width=480,height=640,resizable=yes,scrollbars=yes",
  );
  popup?.focus();
}

async function handleDeleteUser({ id, button }) {
  if (!window.confirm("Are you sure you want to delete this user?")) return;

  try {
    button.disabled = true;
    button.textContent = "Deleting...";
    await deleteUser(id);
    await LoadUsers();
  } catch (error) {
    console.error("Failed to delete user:", error);
    alert(`Could not delete user: ${error.message}`);
    button.disabled = false;
    button.textContent = "Delete";
  }
}

export async function LoadUsers() {
  const tableBody = document.getElementById("usersTableBody");
  if (!tableBody) {
    console.error("Table body not found: #usersTableBody");
    return;
  }

  showTableMessage(tableBody, "Loading users...", USER_COLUMNS.length);

  try {
    const users = await getAllUsers();

    if (!Array.isArray(users) || users.length === 0) {
      showTableMessage(tableBody, "No users found.", USER_COLUMNS.length);
      return;
    }

    renderTableRows(tableBody, users, USER_COLUMNS);
    attachTableActionHandler(tableBody, {
      update: ({ id }) => openUserForm(id),
      delete: handleDeleteUser,
    });
  } catch (error) {
    console.error("Failed to load users:", error);
    showTableMessage(tableBody, "Could not load users. Please refresh the page.", USER_COLUMNS.length);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("create-user-button")?.addEventListener("click", () => {
    openUserForm();
  });

  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin || event.data?.type !== "user-saved") return;
    LoadUsers();
  });

  LoadUsers();
});
