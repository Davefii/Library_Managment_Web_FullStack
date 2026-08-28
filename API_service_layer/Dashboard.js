const API_URL = "https://localhost:7010/";

export async function getDashboardStats() {

    const response = await fetch(
        `${API_URL}Dashboard`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                "Accept": "application/json"
            }
        }
    );

    if (!response.ok) {

        let errorMessage = `Request failed: ${response.status}`;

        try {
            const errorData = await response.json();

            if (errorData.message) {
                errorMessage = errorData.message;
            }
            else if (errorData.title) {
                errorMessage = errorData.title;
            }

        } catch {
            // Response doesn't contain JSON
        }

        throw new Error(errorMessage);
    }

    return await response.json();
}

export async function GetPopularBooksIsReturned() {

    const response = await fetch(
        `${API_URL}PopularBooksIsReturned`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                "Accept": "application/json"
            }
        }
    );

    if (!response.ok) {

        let errorMessage = `Request failed: ${response.status}`;

        try {
            const errorData = await response.json();

            if (errorData.message) {
                errorMessage = errorData.message;
            }
            else if (errorData.title) {
                errorMessage = errorData.title;
            }

        } catch {
            // Response doesn't contain JSON
        }

        throw new Error(errorMessage);
    }

    return await response.json();
}

export async function GetBooksByCategory() {

    const response = await fetch(
        `${API_URL}BooksByCategory`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                "Accept": "application/json"
            }
        }
    );

    if (!response.ok) {

        let errorMessage = `Request failed: ${response.status}`;

        try {
            const errorData = await response.json();

            if (errorData.message) {
                errorMessage = errorData.message;
            }
            else if (errorData.title) {
                errorMessage = errorData.title;
            }

        } catch {
            // Response doesn't contain JSON
        }

        throw new Error(errorMessage);
    }

    return await response.json();
}

export async function GetRecentborrowings() {

    const response = await fetch(
        `${API_URL}Recentborrowings`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                "Accept": "application/json"
            }
        }
    );

    if (!response.ok) {

        let errorMessage = `Request failed: ${response.status}`;

        try {
            const errorData = await response.json();

            if (errorData.message) {
                errorMessage = errorData.message;
            }
            else if (errorData.title) {
                errorMessage = errorData.title;
            }

        } catch {
            // Response doesn't contain JSON
        }

        throw new Error(errorMessage);
    }

    return await response.json();
}