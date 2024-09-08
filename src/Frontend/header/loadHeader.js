document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:8080/header/header.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('header-container').innerHTML = html;
            // Dispatch a custom event to notify that the header is loaded
            document.dispatchEvent(new Event('header-loaded'));
        })
        .catch(error => console.error('Error loading header:', error));
});
