import { LoadAuditLogs } from "../../API_service_layer/AuditLogs.js";
import {
  formatDate,
  renderTableRows,
  showTableMessage,
} from "../SharedModules/TableRenderer.js";

function getAuditLogs(response) {
  if (Array.isArray(response)) return response;
  return response?.data ?? response?.items ?? response?.logs ?? [];
}

function getUserName(log) {
  const user = log.user ?? log.User;
  return user?.email ?? user?.Email ?? log.userEmail ?? log.UserEmail ?? log.userName ?? log.UserName ?? "-";
}

function getDate(log) {
  return formatDate(log.date ?? log.Date ?? log.createdAt ?? log.CreatedAt ?? log.timestamp ?? log.Timestamp);
}

const AUDIT_LOG_COLUMNS = [
  { value: getDate },
  { value: getUserName },
  { value: (log) => log.action ?? log.Action ?? "-" },
  { value: (log) => log.entity ?? log.Entity ?? log.entityName ?? log.EntityName ?? "-" },
  { value: (log) => log.details ?? log.Details ?? log.description ?? log.Description ?? "-" },
];

export async function LoadAuditLogsTable() {
  const tableBody = document.getElementById("auditLogsTableBody");
  if (!tableBody) {
    console.error("Table body not found: #auditLogsTableBody");
    return;
  }

  showTableMessage(tableBody, "Loading audit logs...", AUDIT_LOG_COLUMNS.length);

  try {
    const logs = getAuditLogs(await LoadAuditLogs());

    if (logs.length === 0) {
      showTableMessage(tableBody, "No audit logs found.", AUDIT_LOG_COLUMNS.length);
      return;
    }

    renderTableRows(tableBody, logs, AUDIT_LOG_COLUMNS);
  } catch (error) {
    console.error("Failed to load audit logs:", error);
    showTableMessage(tableBody, "Could not load audit logs. Please refresh the page.", AUDIT_LOG_COLUMNS.length);
  }
}

document.addEventListener("DOMContentLoaded", LoadAuditLogsTable);