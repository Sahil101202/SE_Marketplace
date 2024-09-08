// loadHeader.js
document.addEventListener("DOMContentLoaded", function() {
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        fetch('http://localhost:8080/rootAdmin/assets/html/sidebar.html')
            .then(response => response.text())
            .then(data => {
                headerContainer.innerHTML = data;
                document.dispatchEvent(new Event('header-loaded'));
            })
            .catch(error => console.error('Error loading header:', error));
    }
});
