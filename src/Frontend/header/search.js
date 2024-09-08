// search.js
document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query');

    if (query) {
        searchProducts(query);
    }
});

function searchProducts(query) {
    const apiUrl = `search-results.json?query=${encodeURIComponent(query)}`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displaySearchResults(data);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

function displaySearchResults(data) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; // Clear any existing results

    if (data && data.length > 0) {
        data.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Price: $${product.price}</p>
            `;
            resultsContainer.appendChild(productElement);
        });
    } else {
        resultsContainer.innerHTML = '<p>No products found</p>';
    }
}
