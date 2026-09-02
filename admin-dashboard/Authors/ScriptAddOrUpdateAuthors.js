import {
  addAuthor,
  getAuthorById,
  updateAuthor,
} from "../../API_service_layer/Authors.js";

const authorId = Number(new URLSearchParams(window.location.search).get("id"));
const isUpdateMode = Number.isInteger(authorId) && authorId > 0;
const form = document.getElementById("authorForm");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const nationalityInput = document.getElementById("nationality");
const birthDateInput = document.getElementById("birthDate");
const biographyInput = document.getElementById("biography");
const imageInput = document.getElementById("imageAuthor");
const title = document.querySelector("h1");
const saveButton = form?.querySelector("button[type=submit]");
const cancelButton = form?.querySelector("button[type=button]");

function formatDateForInput(dateValue) {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function setSavingState(isSaving) {
  saveButton.disabled = isSaving;
  saveButton.textContent = isSaving ? "Saving..." : isUpdateMode ? "Update Author" : "Save Author";
}

function closeForm() {
  if (window.opener && !window.opener.closed) window.close();
  else window.location.href = "Authors.html";
}

async function loadForm() {
  setSavingState(true);
  try {
    if (isUpdateMode) {
      title.textContent = "Update Author";
      const author = await getAuthorById(authorId);
      firstNameInput.value = author.firstName ?? author.FirstName ?? "";
      lastNameInput.value = author.lastName ?? author.LastName ?? "";
      nationalityInput.value = author.nationality ?? author.Nationality ?? "";
      birthDateInput.value = formatDateForInput(author.birthDate ?? author.BirthDate);
      biographyInput.value = author.biography ?? author.Biography ?? "";
    }
  } catch (error) {
    alert(`Could not load author details: ${error.message}`);
    closeForm();
  } finally {
    setSavingState(false);
  }
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  setSavingState(true);

  const author = {
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    nationality: nationalityInput.value.trim(),
    birthDate: birthDateInput.value,
    biography: biographyInput.value.trim(),
    imageAuthor: imageInput.files[0] ?? null,
  };

  try {
    if (isUpdateMode) await updateAuthor(authorId, author);
    else await addAuthor(author);
    window.opener?.postMessage({ type: "author-saved" }, window.location.origin);
    alert(isUpdateMode ? "Author updated successfully." : "Author saved successfully.");
    closeForm();
  } catch (error) {
    alert(`Could not save author: ${error.message}`);
    setSavingState(false);
  }
});

cancelButton?.addEventListener("click", closeForm);
document.addEventListener("DOMContentLoaded", loadForm);