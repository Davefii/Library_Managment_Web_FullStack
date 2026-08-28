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

    } catch (error) {

        console.error(
            `Failed to load ${filePath}:`,
            error
        );
    }
}


loadComponent(
    "header",
    "../Components/Header.html"
);

loadComponent(
    "footer",
    "../Components/Footer.html"
);