document.addEventListener('DOMContentLoaded', () => {
    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5001/products');
            const data = await response.json();
            if (data.response) {
                const products = data.data;
                displayRandomProducts(products);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchImage = async (item_id) => {
        try {
            const response = await fetch(`http://localhost:5001/products/image/${item_id}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (data.response) {
                return `data:image/jpeg;base64,${data.data}`;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error fetching image:', error);
            return null;
        }
    };

    const displayRandomProducts = async (products) => {
        const productContainer = document.getElementById('trending-products');

        // Shuffle the array to get random products
        for (let i = products.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [products[i], products[j]] = [products[j], products[i]];
        }

        // Clear the container before adding new content
        productContainer.innerHTML = '';

        // Select the first 6 products
        const randomProducts = products.slice(0, 8);

        for (let product of randomProducts) {
            const item_id = product[0]; // Assuming this is the product ID
            const imageUrl = await fetchImage(item_id);
            
            if (imageUrl) {
                const productElement = document.createElement('div');
                productElement.className = 'bg-white p-6 rounded-lg shadow-lg';
                productElement.innerHTML = `
                    <img src="${imageUrl}" alt="${product[1]}" class="w-full h-48 object-cover rounded-t-lg">
                    <h3 class="mt-4 text-lg font-bold">${product[1]}</h3>
                    <p class="mt-2 text-gray-600">$${product[2]}</p>
                `;
                productContainer.appendChild(productElement);
            }
        }
    };

    fetchProducts();
});
