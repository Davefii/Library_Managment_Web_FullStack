const memberFrame = document.getElementById("memberFrame");
const navigationLinks = document.querySelectorAll(".member-nav a");
navigationLinks.forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        navigationLinks.forEach(navigationLink => navigationLink.removeAttribute("aria-current"));
        link.setAttribute("aria-current", "page");
        memberFrame.src = link.dataset.page;
    });
});