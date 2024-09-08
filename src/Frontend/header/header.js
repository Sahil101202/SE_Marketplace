// header.js
document.addEventListener("DOMContentLoaded", function() {
    setActiveNav();

    const bar = document.getElementById('bar');
    const navbar = document.getElementById('navbar');
    const close = document.getElementById('close');
    const searchButton = document.querySelector('#search-bar button');
    const searchInput = document.querySelector('#search-bar input');

    if (bar && navbar && close) {
        bar.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });

        close.addEventListener('click', () => {
            navbar.classList.remove('active');
        });
    }

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                redirectToSearchResults(query);
            }
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    redirectToSearchResults(query);
                }
            }
        });
    }
});

function setActiveNav() {
    const path = window.location.pathname;
    const page = path.split("/").pop();
    const links = document.querySelectorAll('#navbar a');
    links.forEach(link => {
        const linkHref = link.getAttribute('href').split("/").pop();
        if (linkHref === page) {
            link.classList.add('active');
        }
    });
}

function redirectToSearchResults(query) {
    window.location.href = `http://localhost:8080/header/search.html?query=${encodeURIComponent(query)}`;
}
