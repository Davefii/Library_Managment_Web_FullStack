import { GetCurrentUser } from "../API_service_layer/Users.js";
import {logout} from "../API_service_layer/Authentication.js";
const EMAIL_KEY = "Email";

export async function renderUserMenu() {
    if (!localStorage.getItem(EMAIL_KEY)) {
        return;
    }

    try {
        const currentUser = await GetCurrentUser();
        if (!currentUser) {
            return;
        }
        renderUserMenuForRole(currentUser.role);
    } catch (error) {
        console.error("Unable to load current user:", error);
        localStorage.removeItem(EMAIL_KEY);
    }
}

function renderUserMenuForRole(role) {
    const actions = document.querySelector(".header-actions");
    if (!actions) {
        return;
    }
    
    const email = localStorage.getItem(EMAIL_KEY);
    if (!email) {
        return;
    }

    const loginButton = actions.querySelector("#LoginBtn");
    loginButton?.remove();

    if (actions.querySelector(".user-menu")) {
        return;
    }

    const userMenu = document.createElement("details");
    userMenu.className = "user-menu";

    const summary = document.createElement("summary");
    summary.className = "user-button";
    summary.setAttribute("aria-label", "Open user menu");
    summary.textContent = email.charAt(0).toUpperCase();

    const menu = document.createElement("div");
    menu.className = "user-dropdown";

    const dashboardLink = document.createElement("a");
    if (role === "Admin") {
        dashboardLink.href =
            "../admin-dashboard/index.html";

        dashboardLink.textContent = "Admin Dashboard";
    } else {
        dashboardLink.href =
            "../MemberDashboard/MemberDashboard.html";

        dashboardLink.textContent = "Dashboard";
    }
    const logoutButton = document.createElement("button");
    logoutButton.type = "button";
    logoutButton.textContent = "Logout";
    logoutButton.addEventListener("click", async () => {
        logoutButton.disabled = true;

        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            localStorage.removeItem(EMAIL_KEY);
            window.location.reload();
        }
    });

    menu.append(dashboardLink, logoutButton);
    userMenu.append(summary, menu);
    actions.append(userMenu);
}

