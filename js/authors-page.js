import { getAuthorsForAnyone } from "../API_service_layer/Authors.js";

const authorGrid = document.getElementById("author-grid");


function getAuthorName(author) {
    return `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim() || "Unknown author";
}

function getInitials(name) {
    return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

async function renderAuthors() {
    try {
        const authors = await getAuthorsForAnyone();

        authorGrid.replaceChildren();
        authors.forEach((author, index) => {
            const name = getAuthorName(author);
            const card = document.createElement("a");
            card.className = "author-card card";
            card.href = `../catalog/books-by-author.html?id=${encodeURIComponent(author.id)}`;
            card.innerHTML = '<div class="author-card__avatar"></div><h2></h2><p class="author-card__role">Library author</p><span></span>';
            card.querySelector(".author-card__avatar").textContent = getInitials(name);
            card.querySelector("h2").textContent = name;
            card.querySelector("span").textContent = `${author.totalBooks} ${author.totalBooks === 1 ? "title" : "titles"}`;
            if (index % 4 === 1) {
                card.querySelector(".author-card__avatar").classList.add("author-card__avatar--sand");
            }
            authorGrid.append(card);
        });

        if (!authors.length) {
            authorGrid.innerHTML = '<p class="page-subtitle">No authors are available.</p>';
        }
    } catch (error) {
        authorGrid.innerHTML = '<p class="page-subtitle">Unable to load authors.</p>';
        console.error("Unable to load authors:", error);
    }
}

renderAuthors();
