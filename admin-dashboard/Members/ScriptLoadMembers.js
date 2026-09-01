import { deleteMember, getMembers } from "../../API_service_layer/Members.js";
import {
  attachTableActionHandler,
  formatDate,
  renderTableRows,
  showTableMessage,
} from "../SharedModules/TableRenderer.js";

const MEMBER_COLUMNS = [
  { value: (member) => member.name },
  { value: (member) => member.user?.email },
  { value: (member) => member.phone },
  { value: (member) => member.address },
  {
    render: (member) => {
      const statusBadge = document.createElement("span");
      statusBadge.className = `badge ${member.isActive ? "badge--success" : "badge--danger"}`;
      statusBadge.textContent = member.isActive ? "Active" : "Inactive";
      return statusBadge;
    },
  },
  { value: (member) => formatDate(member.membershipExpiryDate) },
  {
    render: (member) => {
      const actions = document.createElement("div");
      actions.className = "actions";

      const updateButton = document.createElement("button");
      updateButton.type = "button";
      updateButton.className = "button button--small";
      updateButton.dataset.action = "update";
      updateButton.dataset.id = member.id;
      updateButton.textContent = "Update";

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "button button--small button--danger";
      deleteButton.dataset.action = "delete";
      deleteButton.dataset.id = member.id;
      deleteButton.textContent = "Delete";

      actions.append(updateButton, deleteButton);
      return actions;
    },
  },
];

function openMemberForm(memberId) {
  const formUrl = memberId
    ? `MemberFrom.html?id=${encodeURIComponent(memberId)}`
    : "MemberFrom.html";
  const popup = window.open(
    new URL(formUrl, document.baseURI).href,
    "memberForm",
    "width=495,height=660,resizable=no,scrollbars=yes",
  );
  popup?.focus();
}

function handleUpdateMember({ id }) {
  openMemberForm(id);
}

async function handleDeleteMember({ id, button }) {
  if (!window.confirm("Are you sure you want to delete this member?")) return;

  try {
    button.disabled = true;
    button.textContent = "Deleting...";
    await deleteMember(id);
    await LoadMembers();
  } catch (error) {
    console.error("Failed to delete member:", error);
    alert(`Could not delete the member: ${error.message}`);
    button.disabled = false;
    button.textContent = "Delete";
  }
}

export async function LoadMembers() {
  const tableBody = document.getElementById("membersTableBody");
  if (!tableBody) {
    console.error("Table body not found: #membersTableBody");
    return;
  }

  showTableMessage(tableBody, "Loading members...", MEMBER_COLUMNS.length);

  try {
    const members = await getMembers();

    if (!Array.isArray(members) || members.length === 0) {
      showTableMessage(tableBody, "No members found.", MEMBER_COLUMNS.length);
      return;
    }

    renderTableRows(tableBody, members, MEMBER_COLUMNS);
    attachTableActionHandler(tableBody, {
      update: handleUpdateMember,
      delete: handleDeleteMember,
    });
  } catch (error) {
    console.error("Failed to load members:", error);
    showTableMessage(
      tableBody,
      "Could not load members. Please refresh the page.",
      MEMBER_COLUMNS.length,
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("create-member-button")?.addEventListener("click", () => {
    openMemberForm();
  });

  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin || event.data?.type !== "member-saved") return;
    LoadMembers();
  });

  LoadMembers();
});
