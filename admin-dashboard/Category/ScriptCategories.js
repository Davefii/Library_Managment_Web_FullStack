import {
  deleteCategory,
  getCategories,
} from "../../API_service_layer/Category.js";
import {
  attachTableActionHandler,
  renderTableRows,
  showTableMessage,
} from "../SharedModules/TableRenderer.js";

function getCategoryId(category) {
  return category.id ?? category.Id ?? category.ID;
}

function getCategoryName(category) {
  return category.name ?? category.Name ?? "-";
}

function getParentCategoryName(category, categories) {
  const parentId = category.parentId ?? category.ParentId;
  if (parentId === null || parentId === undefined) return "-";

  const parent = categories.find((item) => String(getCategoryId(item)) === String(parentId));
  return parent ? getCategoryName(parent) : String(parentId);
}

function getBookTitles(category) {
  const books = category.books ?? category.Books ?? [];
  const titles = books
    .map((book) => book.title ?? book.Title)
    .filter(Boolean);

  return titles.join(", ") || "-";
}

function createCategoryActions(category) {
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
    button.dataset.id = getCategoryId(category);
    button.textContent = label;
    actions.append(button);
  }

  return actions;
}

function openCategoryForm(categoryId) {
  const formUrl = categoryId
    ? `CategoryForm.html?id=${encodeURIComponent(categoryId)}`
    : "CategoryForm.html";
  const popup = window.open(
    new URL(formUrl, document.baseURI).href,
    "categoryForm",
    "width=500,height=650,resizable=yes,scrollbars=yes",
  );
  popup?.focus();
}

async function handleDeleteCategory({ id, button }) {
  if (!window.confirm("Are you sure you want to delete this category?")) return;

  try {
    button.disabled = true;
    button.textContent = "Deleting...";
    await deleteCategory(id);
    await LoadCategories();
  } catch (error) {
    console.error("Failed to delete category:", error);
    alert(`Could not delete category: ${error.message}`);
    button.disabled = false;
    button.textContent = "Delete";
  }
}

export async function LoadCategories() {
  const tableBody = document.getElementById("categoriesTableBody");
  if (!tableBody) return;

  showTableMessage(tableBody, "Loading categories...", 5);

  try {
    const categories = await getCategories();

    if (!Array.isArray(categories) || categories.length === 0) {
      showTableMessage(tableBody, "No categories found.", 5);
      return;
    }

    const categoryColumns = [
      { value: getCategoryName },
      { value: (category) => category.description ?? category.Description ?? "-" },
      { value: (category) => getParentCategoryName(category, categories) },
      { value: getBookTitles },
      { render: createCategoryActions },
    ];

    renderTableRows(tableBody, categories, categoryColumns);
    attachTableActionHandler(tableBody, {
      update: ({ id }) => openCategoryForm(id),
      delete: handleDeleteCategory,
    });
  } catch (error) {
    console.error("Failed to load categories:", error);
    showTableMessage(tableBody, "Could not load categories. Please refresh the page.", 5);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("createButton")?.addEventListener("click", () => openCategoryForm());
  window.addEventListener("message", (event) => {
    if (event.origin === window.location.origin && event.data?.type === "category-saved") {
      LoadCategories();
    }
  });
  LoadCategories();
});