import { getCategoriesForAnyone } from "../API_service_layer/Category.js";

const categoryGrid = document.getElementById("category-grid");


function getCategoryName(category) {
    return category.name ?? category.categoryName ?? "Unnamed category";
}

async function renderCategories() {
    try {
        const categories = await getCategoriesForAnyone();


        categoryGrid.replaceChildren();
        categories.forEach((category, index) => {
            const tile = document.createElement("a");
            tile.className = `category-tile${ index === 0 ? " category-tile--feature" : ""}`;
            tile.href = `../catalog/books-by-category.html?id=${encodeURIComponent(category.id)}`;
            tile.innerHTML = `${category.totalBooks ? '<span class="section-label">Featured</span>' : ""}<h2></h2><p></p>`;
            tile.querySelector("h2").textContent = getCategoryName(category);
            tile.querySelector("p").textContent = `${category.totalBooks} ${category.totalBooks === 1 ? "book" : "books"}`;
            categoryGrid.append(tile);
        });

        if (!categories.length) {
            categoryGrid.innerHTML = '<p class="page-subtitle">No categories are available.</p>';
        }
    } catch (error) {
        categoryGrid.innerHTML = '<p class="page-subtitle">Unable to load categories.</p>';
        console.error("Unable to load categories:", error);
    }
}

renderCategories();
