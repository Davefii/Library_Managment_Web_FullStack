import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../../API_service_layer/Category.js";

const categoryId = Number(new URLSearchParams(window.location.search).get("id"));
const isUpdateMode = Number.isInteger(categoryId) && categoryId > 0;
const form = document.getElementById("categoryForm");
const nameInput = document.getElementById("name");
const parentInput = document.getElementById("parentId");
const descriptionInput = document.getElementById("description");
const title = document.querySelector("h1");
const saveButton = form?.querySelector("button[type=submit]");
const cancelButton = form?.querySelector("button[type=button]");

function setSavingState(isSaving) {
  saveButton.disabled = isSaving;
  saveButton.textContent = isSaving ? "Saving..." : isUpdateMode ? "Update Category" : "Save Category";
}

function closeForm() {
  if (window.opener && !window.opener.closed) window.close();
  else window.location.href = "Categories.html";
}

async function loadParentCategories() {
  const categories = await getCategories();
  parentInput.replaceChildren(new Option("No parent category", ""));
  for (const category of categories ?? []) {
    const id = category.id ?? category.Id ?? category.ID;
    const option = new Option(category.name ?? category.Name ?? "", id);
    if (String(id) === String(categoryId)) option.disabled = true;
    parentInput.append(option);
  }
}

async function loadForm() {
  setSavingState(true);
  try {
    await loadParentCategories();
    if (isUpdateMode) {
      title.textContent = "Update Category";
      const category = await getCategoryById(categoryId);
      nameInput.value = category.name ?? category.Name ?? "";
      descriptionInput.value = category.description ?? category.Description ?? "";
      parentInput.value = category.parentId ?? category.ParentId ?? "";
    }
  } catch (error) {
    alert(`Could not load category details: ${error.message}`);
    closeForm();
  } finally {
    setSavingState(false);
  }
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  setSavingState(true);

  const category = {
    name: nameInput.value.trim(),
    description: descriptionInput.value.trim(),
    parentId: parentInput.value ? Number(parentInput.value) : null,
  };

  try {
    if (isUpdateMode) await updateCategory(categoryId, category);
    else await createCategory(category);
    window.opener?.postMessage({ type: "category-saved" }, window.location.origin);
    alert(isUpdateMode ? "Category updated successfully." : "Category saved successfully.");
    closeForm();
  } catch (error) {
    alert(`Could not save category: ${error.message}`);
    setSavingState(false);
  }
});

cancelButton?.addEventListener("click", closeForm);
document.addEventListener("DOMContentLoaded", loadForm);