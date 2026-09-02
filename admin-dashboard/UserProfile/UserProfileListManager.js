import {
  deleteUserProfile,
  getAllUserProfiles,
} from "../../API_service_layer/UsersProfile.js";
import {
  attachTableActionHandler,
  renderTableRows,
  showTableMessage,
} from "../SharedModules/TableRenderer.js";

function createProfileActions(profile) {
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
    button.dataset.id = profile.id;
    button.textContent = label;
    actions.append(button);
  }

  return actions;
}

function createProfileColumns() {
  return [
    { value: (profile) => profile.user?.email ?? "Unknown user" },
    { value: (profile) => profile.firstName },
    { value: (profile) => profile.lastName },
    { value: (profile) => profile.phoneNumber },
    { value: (profile) => profile.address },
    { render: createProfileActions },
  ];
}

function openUserProfileForm(profileId) {
  const formUrl = profileId
    ? `UserProfileForm.html?id=${encodeURIComponent(profileId)}`
    : "UserProfileForm.html";
  const popup = window.open(
    new URL(formUrl, document.baseURI).href,
    "userProfileForm",
    "width=500,height=720,resizable=yes,scrollbars=yes",
  );
  popup?.focus();
}

async function handleDeleteUserProfile({ id, button }) {
  if (!window.confirm("Are you sure you want to delete this user profile? The user account will remain.")) return;

  try {
    button.disabled = true;
    button.textContent = "Deleting...";
    await deleteUserProfile(id);
    await LoadUserProfiles();
  } catch (error) {
    console.error("Failed to delete user profile:", error);
    alert(`Could not delete user profile: ${error.message}`);
    button.disabled = false;
    button.textContent = "Delete";
  }
}

export async function LoadUserProfiles() {
  const tableBody = document.getElementById("user-profiles-table-body");
  if (!tableBody) {
    console.error("Table body not found: #user-profiles-table-body");
    return;
  }

  showTableMessage(tableBody, "Loading user profiles...", 6);

  try {
    const profiles = await getAllUserProfiles();

    if (!Array.isArray(profiles) || profiles.length === 0) {
      showTableMessage(tableBody, "No user profiles found.", 6);
      return;
    }

    const profileColumns = createProfileColumns();
    renderTableRows(tableBody, profiles, profileColumns);
    attachTableActionHandler(tableBody, {
      update: ({ id }) => openUserProfileForm(id),
      delete: handleDeleteUserProfile,
    });
  } catch (error) {
    console.error("Failed to load user profiles:", error);
    showTableMessage(tableBody, "Could not load user profiles. Please refresh the page.", 6);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("create-user-profile-button")?.addEventListener("click", () => {
    openUserProfileForm();
  });

  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin || event.data?.type !== "user-profile-saved") return;
    LoadUserProfiles();
  });

  LoadUserProfiles();
});
