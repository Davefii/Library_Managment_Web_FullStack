import { renderUserMenu } from "./auth.js";

async function loadComponent(elementId, filePath) {

    const element = document.getElementById(elementId);

    if (!element) {
        return;
    }

    try {

        const url = new URL(
            filePath,
            import.meta.url
        );

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Failed to load component: ${response.status}`
            );
        }

        element.innerHTML = await response.text();

        if (elementId === "header") {
            renderUserMenu();
        }

    } catch (error) {

        console.error(
            `Failed to load ${filePath}:`,
            error
        );
    }
}


loadComponent(
    "header",
    "../Components/header.html"
);

loadComponent(
    "footer",
    "../Components/Footer.html"
);

