const API_URL = "https://localhost:7010/api/AuditLogs/";

async function handleResponse(response) {
  let body = null;

  try {
    body = await response.json();
  } catch {
    // Response has no JSON body.
  }

  if (!response.ok) {
    throw new Error(
      body?.message ||
      body?.title ||
      `Request failed: ${response.status}`,
    );
  }

  return body;
}

export async function LoadAuditLogs() {
  const response = await fetch(`${API_URL}LoadAuditLogs`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  return await handleResponse(response);
}