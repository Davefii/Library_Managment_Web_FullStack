import { getAuthorsForAnyone } from "../API_service_layer/Authors.js";
import { TotalBooksByAuthor } from "../API_service_layer/Books.js";

const authorGrid = document.getElementById("author-grid");

function getAuthorId(author) {
    return author.id ?? author.authorId;
}

function getAuthorName(author) {
    return `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim() || "Unknown author";
}

function getInitials(name) {
    return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

async function renderAuthors() {
    try {
        const authors = await getAuthorsForAnyone();
        const items = await Promise.all((authors ?? []).map(async (author) => {
            const id = getAuthorId(author);
            const count = await TotalBooksByAuthor(id);
            return { author, id, count: count?.totalBooks ?? 0 };
        }));

        authorGrid.replaceChildren();
        items.forEach(({ author, id, count }, index) => {
            const name = getAuthorName(author);
            const card = document.createElement("a");
            card.className = "author-card card";
            card.href = `../catalog/books-by-author.html?id=${encodeURIComponent(id)}`;
            card.innerHTML = '<div class="author-card__avatar"></div><h2></h2><p class="author-card__role">Library author</p><span></span>';
            card.querySelector(".author-card__avatar").textContent = getInitials(name);
            card.querySelector("h2").textContent = name;
            card.querySelector("span").textContent = `${count} ${count === 1 ? "title" : "titles"}`;
            if (index % 4 === 1) {
                card.querySelector(".author-card__avatar").classList.add("author-card__avatar--sand");
            }
            authorGrid.append(card);
        });

        if (!items.length) {
            authorGrid.innerHTML = '<p class="page-subtitle">No authors are available.</p>';
        }
    } catch (error) {
        authorGrid.innerHTML = '<p class="page-subtitle">Unable to load authors.</p>';
        console.error("Unable to load authors:", error);
    }
}

renderAuthors();
