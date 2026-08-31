import { deleteMember, getMembers } from "../../API_service_layer/Members.js";

const MEMBERS_TABLE_COLUMN_COUNT = 7;

function formatDate(dateValue) {
  if (!dateValue) return "-";

  const date = new Date(dateValue);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
}

function createTableCell(value) {
  const cell = document.createElement("td");
  cell.textContent = value ?? "-";
  return cell;
}

function showTableMessage(tableBody, message) {
  tableBody.replaceChildren();

  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.colSpan = MEMBERS_TABLE_COLUMN_COUNT;
  cell.className = "empty-state";
  cell.textContent = message;
  row.append(cell);
  tableBody.append(row);
}

function createMemberRow(member) {
  const row = document.createElement("tr");
  row.dataset.memberId = member.id;

  row.append(
    createTableCell(member.name),
    createTableCell(member.user?.email),
    createTableCell(member.phone),
    createTableCell(member.address),
  );

  const statusCell = document.createElement("td");
  const statusBadge = document.createElement("span");
  statusBadge.className = `badge ${member.isActive ? "badge--success" : "badge--danger"}`;
  statusBadge.textContent = member.isActive ? "Active" : "Inactive";
  statusCell.append(statusBadge);
  row.append(statusCell, createTableCell(formatDate(member.membershipExpiryDate)));

  const actionsCell = document.createElement("td");
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
  actionsCell.append(actions);
  row.append(actionsCell);
  return row;
}

function attachMemberActionHandler(tableBody) {
  if (tableBody.dataset.actionsReady === "true") return;
  tableBody.dataset.actionsReady = "true";

  tableBody.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    if (button.dataset.action === "update") {
      // The update page/behavior will be added later.
      return;
    }

    if (button.dataset.action !== "delete") return;

    const memberId = button.dataset.id;
    if (!memberId) return;

    if (!window.confirm("Are you sure you want to delete this member?")) return;

    try {
      button.disabled = true;
      button.textContent = "Deleting...";
      await deleteMember(memberId);
      await LoadMembers();
    } catch (error) {
      console.error("Failed to delete member:", error);
      alert(`Could not delete the member: ${error.message}`);
      button.disabled = false;
      button.textContent = "Delete";
    }
  });
}

export async function LoadMembers() {
  const tableBody = document.getElementById("membersTableBody");
  if (!tableBody) {
    console.error("Table body not found: #membersTableBody");
    return;
  }

  showTableMessage(tableBody, "Loading members...");

  try {
    const members = await getMembers();

    if (!Array.isArray(members) || members.length === 0) {
      showTableMessage(tableBody, "No members found.");
      return;
    }

    const memberRows = members.map(createMemberRow);
    tableBody.replaceChildren(...memberRows);
    attachMemberActionHandler(tableBody);
  } catch (error) {
    console.error("Failed to load members:", error);
    showTableMessage(tableBody, "Could not load members. Please refresh the page.");
  }
}

document.addEventListener("DOMContentLoaded", LoadMembers);
