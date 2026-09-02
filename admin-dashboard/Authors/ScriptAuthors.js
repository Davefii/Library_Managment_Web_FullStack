import {
  deleteAuthor,
  getAuthors,
} from "../../API_service_layer/Authors.js";
import {
  attachTableActionHandler,
  renderTableRows,
  showTableMessage,
} from "../SharedModules/TableRenderer.js";

function getAuthorId(author) {
  return author.id ?? author.Id ?? author.ID;
}

function getAuthorName(author) {
  const firstName = author.firstName ?? author.FirstName ?? "";
  const lastName = author.lastName ?? author.LastName ?? "";
  return `${firstName} ${lastName}`.trim() || "-";
}

function createAuthorImage(author) {
  const image = document.createElement("img");
  const imagePath = author.imageAuthor ?? author.ImageAuthor;
  if (imagePath) image.src = `https://localhost:7010/${imagePath}`;
  image.alt = imagePath ? `${getAuthorName(author)} portrait` : "No author image available";
  image.width = 60;
  image.height = 70;
  image.style.objectFit = "cover";
  return image;
}

function createAuthorActions(author) {
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
    button.dataset.id = getAuthorId(author);
    button.textContent = label;
    actions.append(button);
  }

  return actions;
}

function openAuthorForm(authorId) {
  const formUrl = authorId
    ? `AuthorForm.html?id=${encodeURIComponent(authorId)}`
    : "AuthorForm.html";
  const popup = window.open(
    new URL(formUrl, document.baseURI).href,
    "authorForm",
    "width=600,height=750,resizable=no,scrollbars=yes",
  );
  popup?.focus();
}

async function handleDeleteAuthor({ id, button }) {
  if (!window.confirm("Are you sure you want to delete this author?")) return;

  try {
    button.disabled = true;
    button.textContent = "Deleting...";
    await deleteAuthor(id);
    await LoadAuthors();
  } catch (error) {
    console.error("Failed to delete author:", error);
    alert(`Could not delete author: ${error.message}`);
    button.disabled = false;
    button.textContent = "Delete";
  }
}

export async function LoadAuthors() {
  const tableBody = document.getElementById("authorsTableBody");
  if (!tableBody) return;

  showTableMessage(tableBody, "Loading authors...", 6);

  try {
    const authors = await getAuthors();
    if (!Array.isArray(authors) || authors.length === 0) {
      showTableMessage(tableBody, "No authors found.", 6);
      return;
    }

    const authorColumns = [
      { render: createAuthorImage },
      { value: getAuthorName },
      { value: (author) => author.nationality ?? author.Nationality ?? "-" },
      { value: (author) => author.birthDate ?? author.BirthDate ?? "-" },
      { value: (author) => author.biography ?? author.Biography ?? "-" },
      { render: createAuthorActions },
    ];

    renderTableRows(tableBody, authors, authorColumns);
    attachTableActionHandler(tableBody, {
      update: ({ id }) => openAuthorForm(id),
      delete: handleDeleteAuthor,
    });
  } catch (error) {
    console.error("Failed to load authors:", error);
    showTableMessage(tableBody, "Could not load authors. Please refresh the page.", 6);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("createButton")?.addEventListener("click", () => openAuthorForm());
  window.addEventListener("message", (event) => {
    if (event.origin === window.location.origin && event.data?.type === "author-saved") {
      LoadAuthors();
    }
  });
  LoadAuthors();
});