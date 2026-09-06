import { getCategoriesForAnyone } from "../API_service_layer/Category.js";
import { TotalBooksByCategory } from "../API_service_layer/Books.js";

const categoryGrid = document.getElementById("category-grid");

function getCategoryId(category) {
    return category.id ?? category.categoryId;
}

function getCategoryName(category) {
    return category.name ?? category.categoryName ?? "Unnamed category";
}

async function renderCategories() {
    try {
        const categories = await getCategoriesForAnyone();
        const items = await Promise.all((categories ?? []).map(async (category) => {
            const id = getCategoryId(category);
            const count = await TotalBooksByCategory(id);
            return { category, id, count: count?.totalBooks ?? 0 };
        }));

        categoryGrid.replaceChildren();
        items.forEach(({ category, id, count }, index) => {
            const tile = document.createElement("a");
            tile.className = `category-tile${index === 0 ? " category-tile--feature" : ""}`;
            tile.href = `../catalog/books-by-category.html?id=${encodeURIComponent(id)}`;
            tile.innerHTML = `${index === 0 ? '<span class="section-label">Featured</span>' : ""}<h2></h2><p></p>`;
            tile.querySelector("h2").textContent = getCategoryName(category);
            tile.querySelector("p").textContent = `${count} ${count === 1 ? "book" : "books"}`;
            categoryGrid.append(tile);
        });

        if (!items.length) {
            categoryGrid.innerHTML = '<p class="page-subtitle">No categories are available.</p>';
        }
    } catch (error) {
        categoryGrid.innerHTML = '<p class="page-subtitle">Unable to load categories.</p>';
        console.error("Unable to load categories:", error);
    }
}

renderCategories();
