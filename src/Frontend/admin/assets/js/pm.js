

document.addEventListener('DOMContentLoaded', () => {
    // Function to show the appropriate form
    window.showForm = function(formType) {
        document.getElementById('crud-form-container').classList.remove('hidden');
        document.getElementById('crud-form-title').innerText = formType.charAt(0).toUpperCase() + formType.slice(1) + " Product";

        // Hide all forms
        const forms = ['create-form', 'read-form', 'update-form', 'delete-form'];
        forms.forEach(form => document.getElementById(form).classList.add('hidden'));

        // Show the selected form
        document.getElementById(`${formType}-form`).classList.remove('hidden');

        if (formType === 'read') {
            fetchProducts();
        } else if (formType === 'update' || formType === 'delete') {
            populateProductOptions(formType);
        }
    };

    // Function to hide the form
    window.hideForm = function() {
        document.getElementById('crud-form-container').classList.add('hidden');
    };

    // Function to create a new product
    window.createProduct = function() {
        const productName = document.getElementById('product-name').value;
        const category = document.getElementById('category').value;
        const price = document.getElementById('price').value;
        const stockQuantity = document.getElementById('stock-quantity').value;
        const description = document.getElementById('des').value;
        const productImage = document.getElementById('product-image').files[0]; // Get the file input

        const reader = new FileReader();

        reader.onloadend = function() {
            const base64Image = reader.result.split(',')[1]; // Get the base64 part

            const product = {
                token: localStorage.getItem('seller'),
                name: productName,
                category_id: category,
                price: price,
                quantity: stockQuantity,
                description: description,
                product_image: base64Image // Include the base64 image string
            };

            console.log('product create', product);

            fetch('http://localhost:5001/products/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                hideForm();
            })
            .catch(error => console.error('Error:', error));
        };

        if (productImage) {
            reader.readAsDataURL(productImage); // Convert the image file to base64
        } else {
            alert('Please select an image.');
        }
    };

    // Dummy hideForm function to close the form after product creation
    function hideForm() {
        document.getElementById('product-form').reset(); // Reset the form
        // Additional code to hide the form if needed
    }


    // // Function to fetch and display product details
    // function fetchProducts() {
    //     fetch('http://localhost:5001/products')
    //     .then(response => response.json())
    //     .then(products => {
    //         const productList = document.getElementById('product-list');
    //         productList.innerHTML = '';

    //         products.forEach(product => {
    //             const productItem = document.createElement('div');
    //             productItem.innerText = `Name: ${product.name}, Category: ${product.category}, Price: ${product.price}, Stock: ${product.stock}`;
    //             productList.appendChild(productItem);
    //         });
    //     })
    //     .catch(error => console.error('Error:', error));
    // }

    // // Function to populate product options for update and delete forms
    // function populateProductOptions(formType) {
    //     fetch('http://localhost:5001/products/${productId}')
    //     .then(response => response.json())
    //     .then(products => {
    //         const selectElement = document.getElementById(`${formType}-product-select`);
    //         selectElement.innerHTML = '';

    //         products.forEach(product => {
    //             const option = document.createElement('option');
    //             option.value = product.id;
    //             option.innerText = product.name;
    //             selectElement.appendChild(option);
    //         });
    //     })
    //     .catch(error => console.error('Error:', error));
    // }

    // Function to update a product
    window.updateProduct = function() {
        const productName = document.getElementById('update-product-name').value;
        const category = document.getElementById('update-category').value;
        const price = document.getElementById('update-price').value;
        const stockQuantity = document.getElementById('update-stock-quantity').value;

        const product = {
            name: productName,
            category_id: category,
            price: price,
            quantity: stockQuantity
        };

        fetch('http://localhost:5001/products/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
        .then(response => response.json())
        .then(data => {
            alert('Product updated successfully!');
            hideForm();
        })
        .catch(error => console.error('Error:', error));
    };

    // Function to delete a product
    window.deleteProduct = function() {
        const productId = document.getElementById('delete-product-select').value;

        fetch(`/products/${productId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert('Product deleted successfully!');
            hideForm();
        })
        .catch(error => console.error('Error:', error));
    };
});


const token = localStorage.getItem('seller');
const arrayToken = token.split('.');
if (arrayToken.length !== 3) {
    throw new Error("Invalid token format");
}
const tokenPayload = JSON.parse(atob(arrayToken[1]));
console.log("Token", tokenPayload);  
const sellerId = tokenPayload.id;

console.log("seller id ", sellerId);

// Sample JSON data to simulate API response
let sampleData = {
    totalProducts: 'Loading...',
    MaxPrice: 'Loading...',
    MinPrice: 'Loading...',
    categories: 'Loading...',
    averagePrice: 'Loading...',
    totalSales: 'Loading...',
    products: [
        { id: 'Loading...', category: 'Loading...', item: 'Loading...', price: 'Loading...' , quantity: 'Loading...'}
    ],
    cat: [
        { id: 'Loading...', name: 'Loading...' }
    ]
};

const fetchAllProduct = async (sampleData) => {
    try {
        let url = `http://localhost:5001/products/seller/${sellerId}`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log("products :", json.data);
            sampleData.products = json.data;
        } else {
            console.error(json.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const fetchProductsCount = async (sampleData) => {
    try {
        let url = `http://localhost:5001/products/counts/${sellerId}`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log("product count",json.data[0][0]);
            sampleData.totalProducts = json.data[0][0];
        } else {
            console.error(json.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const fetchCategoies = async (sampleData) => {
    try {
        let url = `http://localhost:5001/categories`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log("category data",json.data);
            sampleData.cat = json.data;
        } else {
            console.error(json.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const fetchCatCount = async (sampleData) => {
    try {
        let url = `http://localhost:5001/products/category_counts/${sellerId}`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log("category count",json.data[0][0]);
            sampleData.categories = json.data[0][0];
        } else {
            console.error(json.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const fetchMaxPrice = async (sampleData) => {
    try {
        let url = `http://localhost:5001/products/max_price/${sellerId}`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log("max price count",json.data[0][0]);
            sampleData.MaxPrice = json.data[0][0];
        } else {
            console.error(json.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const fetchMinPrice = async (sampleData) => {
    try {
        let url = `http://localhost:5001/products/min_price/${sellerId}`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log("min price count",json.data[0][0]);
            sampleData.MinPrice = json.data[0][0];
        } else {
            console.error(json.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const fetchAvgPrice = async (sampleData) => {
    try {
        let url = `http://localhost:5001/products/avg_price/${sellerId}`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log("average price count",json.data[0][0]);
            sampleData.averagePrice = json.data[0][0];
        } else {
            console.error(json.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

// const fetchTotalSales = async (sampleData) => {
//     try {
//         let url = `http://localhost:5001/orders/total_order/${sellerId}`;
//         const response = await fetch(url);
//         const json = await response.json();
//         if (json.response) {
//             console.log("total order count",json.data[0][0]);
//             sampleData.totalSales = json.data[0][0];
//         } else {
//             console.error(json.message);
//         }
//     } catch (error) {
//         console.error('Error fetching products:', error);
//     }
// };

// Function to fetch data (simulated with sampleData for testing)
async function fetchData() {
    try {
        // Simulate fetching data from an API
        const data = sampleData;
        await fetchProductsCount(data);
        await fetchCatCount(data);
        await fetchAvgPrice(data);
        await fetchMaxPrice(data);
        await fetchMinPrice(data);
        // await fetchTotalSales(data);
        await fetchAllProduct(data);
        await fetchCategoies(data);
        console.log(data);
        // Update UI with fetched data
        document.getElementById('total-products').innerText = data.totalProducts;
        document.getElementById('max-price').innerText = `$${data.MaxPrice.toFixed(2)}`;
        document.getElementById('min-price').innerText = `$${data.MinPrice.toFixed(2)}`;
        document.getElementById('categories').innerText = data.categories;
        document.getElementById('average-price').innerText = `$${data.averagePrice.toFixed(2)}`;
        // document.getElementById('total-sales').innerText = data.totalSales;

        // Populate user list
        const userTableBody = document.getElementById('cat-table-body');
        data.cat.forEach(category => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-2 px-4 border-b ">${category[0]}</td>
                <td class="py-2 px-4 border-b ">${category[1]}</td>
            `;
            userTableBody.appendChild(row);
        });

        // Populate user list
        const productTableBody = document.getElementById('user-table-body');
        data.products.forEach(product => {
            console.log("product", product);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-2 px-4 border-b">${product[0]}</td>
                <td class="py-2 px-4 border-b">${product[1]}</td>
                <td class="py-2 px-4 border-b">${product[2]}</td>
                <td class="py-2 px-4 border-b">${product[3]}</td>
                <td class="py-2 px-4 border-b">${product[4]}</td>
            `;
            productTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Fetch data and update dashboard on page load
window.onload = fetchData;

