document.addEventListener('DOMContentLoaded', () => {
    let selectedCategory = 'all';
    let selectedSubcategory = 'all';
    let currentPage = 1;
    const productsPerPage = 30;
    let allProducts = [];

    const productGrid = document.getElementById('productGrid');
    const pagination = document.getElementById('pagination');
    const priceFilter = document.getElementById('priceFilter');

    const fetchProducts = async () => {
        try {
            const response = await fetch(`http://localhost:5001/products`);
            const data = await response.json();
            if (data.response) {
                allProducts = data.data;
                const filteredProducts = filterProducts(allProducts);
                displayProducts(filteredProducts);
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

    function filterProducts(products) {
        let filteredProducts = products;
    
        console.log(`Filtering by category: ${selectedCategory}, subcategory: ${selectedSubcategory}`);
    
        // Filter by category if not 'all'
        if (selectedCategory !== 'all') {
            filteredProducts = filteredProducts.filter(product => product[4].toLowerCase() === selectedCategory.toLowerCase());
        }
    
        // Filter by subcategory if not 'all'
        if (selectedSubcategory !== 'all') {
            filteredProducts = filteredProducts.filter(product => product[3].toLowerCase() === selectedSubcategory.toLowerCase());
        }
    
        console.log(`Filtered products count: ${filteredProducts.length}`);
        return sortProducts(filteredProducts, priceFilter.value);
    }    
    

    function sortProducts(products, sortBy) {
        if (sortBy === 'price-low-high') {
            return products.sort((a, b) => a[2] - b[2]); // Accessing price using index 2
        } else if (sortBy === 'price-high-low') {
            return products.sort((a, b) => b[2] - a[2]); // Accessing price using index 2
        } else if (sortBy === 'new-arrivals') {
            return products.sort((a, b) => b[0] - a[0]); // Accessing ID using index 0
        } else {
            return products;
        }
    }
    

    const displayProducts = async (products) => {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const paginatedProducts = products.slice(startIndex, endIndex);

        productGrid.innerHTML = '';
        if (paginatedProducts.length === 0) {
            productGrid.innerHTML = '<p class="text-center text-gray-600">No products found.</p>';
        } else {
            for (const product of paginatedProducts) {
                const item_id = product[0];
                const name = product[1];
                const price = product[2];
                const category_id = product[5];
                const productElement = document.createElement('div');
                productElement.className = 'product-card bg-white shadow-lg rounded-lg p-4';

                const imageUrl = await fetchImage(item_id);

                productElement.innerHTML = `
                    ${imageUrl ? `<img src="${imageUrl}" alt="${name}" class="w-full h-auto rounded-lg mb-4">` : ''}
                    <h3 class="text-lg font-bold text-left">${name}</h3>
                    <p class="text-blue-800 font-semibold text-left">$${price}</p>
                `;

                productElement.addEventListener('click', () => {
                    window.open(`http://localhost:8080/product/product_details.html?id=${item_id}&category_id=${category_id}`, '_blank');
                });

                productGrid.appendChild(productElement);
            }
            updatePagination(products.length);
        }
    };

    const updatePagination = (totalProducts) => {
        pagination.innerHTML = '';
        const totalPages = Math.ceil(totalProducts / productsPerPage);
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = `px-3 py-1 rounded-lg ${i === currentPage ? 'bg-orange-500 text-black' : 'bg-gray-200 text-black'}`;
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayProducts(filterProducts(allProducts));
            });
            pagination.appendChild(pageButton);
        }
    };

    document.querySelectorAll('.category-button').forEach(button => {
        button.addEventListener('click', () => {
            const subcategoryList = button.nextElementSibling;
    
            // If the selected category is not 'All', toggle subcategories
            if (button.getAttribute('data-category') !== 'all') {
                subcategoryList.classList.toggle('hidden');
    
                const allSubcategoryLists = document.querySelectorAll('.category-button + ul');
                allSubcategoryLists.forEach(list => {
                    if (list !== subcategoryList) {
                        list.classList.add('hidden');
                    }
                });
            } else {
                // If 'All' is selected, make sure all subcategory lists are hidden
                document.querySelectorAll('.category-button + ul').forEach(list => {
                    list.classList.add('hidden');
                });
            }
    
            // Set the selected category and subcategory
            selectedCategory = button.getAttribute('data-category');
            selectedSubcategory = 'all';
    
            // Filter and display products
            const filteredProducts = filterProducts(allProducts);
            displayProducts(filteredProducts);
        });
    });
    

    document.querySelectorAll('[data-subcategory]').forEach(button => {
        button.addEventListener('click', () => {
            selectedCategory = button.getAttribute('data-category');
            selectedSubcategory = button.getAttribute('data-subcategory');
            const filteredProducts = filterProducts(allProducts);
            displayProducts(filteredProducts);
        });
    });

    priceFilter.addEventListener('change', () => {
        const filteredProducts = filterProducts(allProducts);
        displayProducts(filteredProducts);
    });

    // Fetch and display all products when the page loads
    fetchProducts();
});
