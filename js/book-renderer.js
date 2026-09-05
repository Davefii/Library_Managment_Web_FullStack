const API_ORIGIN = "https://localhost:7010/";
const DETAILS_PATH = "../book-details/Details_Book.html";

let cardTemplatePromise;

async function getCardTemplate() {
    if (!cardTemplatePromise) {
        cardTemplatePromise = fetch(
            new URL("../Components/Book_Cart.html", import.meta.url)
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load book card: ${response.status}`);
                }

                return response.text();
            })
            .then((html) => {
                const template = document.createElement("template");
                template.innerHTML = html;
                return template.content.querySelector("[data-book-card]");
            });
    }

    return cardTemplatePromise;
}

function getAuthorNames(book) {
    return book.authors?.
        map((author) => `${author.firstName} ${author.lastName}`)
        .join(", ") || "Unknown author";
}

function getCoverUrl(coverImage) {
    if (!coverImage) {
        return null;
    }

    return new URL(coverImage, API_ORIGIN).href;
}

function setBookCover(cover, book) {
    const coverUrl = getCoverUrl(book.coverImage);

    if (coverUrl) {
        const image = document.createElement("img");
        image.src = coverUrl;
        image.alt = `${book.title} cover`;
        cover.append(image);
        return;
    }

    cover.textContent = book.title
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 3)
        .toUpperCase();
}

export async function renderBooks(container, books) {
    const template = await getCardTemplate();
    container.replaceChildren();

    for (const book of books) {
        const card = template.cloneNode(true);
        const availability = card.querySelector("[data-book-availability]");

        setBookCover(card.querySelector("[data-book-cover]"), book);
        card.querySelector("[data-book-title]").textContent = book.title;
        card.querySelector("[data-book-author]").textContent = getAuthorNames(book);
        card.querySelector("[data-book-category]").textContent = book.categories?.[0]?.name || "Uncategorized";
        availability.textContent = book.isAvailable
            ? `${book.availableCopies} available`
            : "On loan";
        availability.className = `badge ${book.isAvailable ? "badge--success" : "badge--warning"}`;

        const detailsLink = card.querySelector("[data-book-details]");
        detailsLink.href = `${DETAILS_PATH}?id=${book.id}`;

        container.append(card);
    }
}