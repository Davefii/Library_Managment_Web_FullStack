const adminFrame = document.getElementById("adminFrame");
const navigationLinks = document.querySelectorAll(".admin-nav a");

navigationLinks.forEach(link => {

    link.addEventListener("click", function (event) {

        event.preventDefault();

        const page = this.dataset.page;
        navigationLinks.forEach(navigationLink => {
            navigationLink.removeAttribute("aria-current");
        });
        this.setAttribute("aria-current", "page");
        adminFrame.src = page;
    });

});