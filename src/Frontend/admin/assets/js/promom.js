

// document.addEventListener('DOMContentLoaded', () => {
//     // Function to show the appropriate form
//     window.showForm = function(formType) {
//         document.getElementById('crud-form-container').classList.remove('hidden');
//         document.getElementById('crud-form-title').innerText = formType.charAt(0).toUpperCase() + formType.slice(1) + " Product";

//         // Hide all forms
//         const forms = ['create-form', 'read-form', 'update-form', 'delete-form'];
//         forms.forEach(form => document.getElementById(form).classList.add('hidden'));

//         // Show the selected form
//         document.getElementById(`${formType}-form`).classList.remove('hidden');

//         if (formType === 'read') {
//             fetchProducts();
//         } else if (formType === 'update' || formType === 'delete') {
//             populateProductOptions(formType);
//         }
//     };

//     // Function to hide the form
//     window.hideForm = function() {
//         document.getElementById('crud-form-container').classList.add('hidden');
//     };

//     // Function to create a new product
//     window.createProduct = function() {
//         const productName = document.getElementById('product-name').value;
//         const category = document.getElementById('category').value;
//         const price = document.getElementById('price').value;
//         const stockQuantity = document.getElementById('stock-quantity').value;

//         const product = {
//             name: productName,
//             category: category,
//             price: price,
//             stock: stockQuantity
//         };

//         fetch('http://localhost:5001/products/add', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(product)
//         })
//         .then(response => response.json())
//         .then(data => {
//             alert('Product created successfully!');
//             hideForm();
//         })
//         .catch(error => console.error('Error:', error));
//     };

//     // Function to fetch and display product details
//     function fetchProducts() {
//         fetch('http://localhost:5001/products')
//         .then(response => response.json())
//         .then(products => {
//             const productList = document.getElementById('product-list');
//             productList.innerHTML = '';

//             products.forEach(product => {
//                 const productItem = document.createElement('div');
//                 productItem.innerText = `Name: ${product.name}, Category: ${product.category}, Price: ${product.price}, Stock: ${product.stock}`;
//                 productList.appendChild(productItem);
//             });
//         })
//         .catch(error => console.error('Error:', error));
//     }

//     // Function to populate product options for update and delete forms
//     function populateProductOptions(formType) {
//         fetch('http://localhost:5001/products/${productId}')
//         .then(response => response.json())
//         .then(products => {
//             const selectElement = document.getElementById(`${formType}-product-select`);
//             selectElement.innerHTML = '';

//             products.forEach(product => {
//                 const option = document.createElement('option');
//                 option.value = product.id;
//                 option.innerText = product.name;
//                 selectElement.appendChild(option);
//             });
//         })
//         .catch(error => console.error('Error:', error));
//     }

//     // Function to update a product
//     window.updateProduct = function() {
//         const productId = document.getElementById('update-product-select').value;
//         const productName = document.getElementById('update-product-name').value;
//         const category = document.getElementById('update-category').value;
//         const price = document.getElementById('update-price').value;
//         const stockQuantity = document.getElementById('update-stock-quantity').value;

//         const product = {
//             name: productName,
//             category: category,
//             price: price,
//             stock: stockQuantity
//         };

//         fetch('http://localhost:5001/products/${productId}', {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(product)
//         })
//         .then(response => response.json())
//         .then(data => {
//             alert('Product updated successfully!');
//             hideForm();
//         })
//         .catch(error => console.error('Error:', error));
//     };

//     // Function to delete a product
//     window.deleteProduct = function() {
//         const productId = document.getElementById('delete-product-select').value;

//         fetch(`/api/products/${productId}`, {
//             method: 'DELETE'
//         })
//         .then(response => response.json())
//         .then(data => {
//             alert('Product deleted successfully!');
//             hideForm();
//         })
//         .catch(error => console.error('Error:', error));
//     };
// });


// // Sample JSON data to simulate API response
// const sampleData = {
//     totalPromotions: 'Loading...',
//     activePromotions: 'Loading...',
//     expiredPromotions: 'Loading...',
//     averagePercentDiscount: 'Loading...',
//     averageDollarDiscount: 'Loading...',
//     promos: [
//         { id: 'Loading...', name: 'Loading...', discount_rate: 'Loading...', start_date: 'Loading...', end_date: 'Loading...' }
//     ],
// };

// const fetchAllPromo = async (sampleData) => {
//     try {
//         let url = `http://localhost:5001/promotions/allPromotios`;
//         const response = await fetch(url);
//         const json = await response.json();
//         if (json.response) {
//             console.log(json.data);
//             sampleData.promos = json.data;
//         } else {
//             console.error(json.message);
//         }
//     } catch (error) {
//         console.error('Error fetching products:', error);
//     }
// };

// const fetchPromosCount = async (sampleData) => {
//     try {
//         let url = `http://localhost:5001/promotions/counts`;
//         const response = await fetch(url);
//         const json = await response.json();
//         if (json.response) {
//             console.log(json.data[0].num);
//             sampleData.totalPromotions = json.data[0].num;
//         } else {
//             console.error(json.message);
//         }
//     } catch (error) {
//         console.error('Error fetching products:', error);
//     }
// };

// const fetchPromosActive = async (sampleData) => {
//     try {
//         let url = `http://localhost:5001/promotions/activeCounts`;
//         const response = await fetch(url);
//         const json = await response.json();
//         if (json.response) {
//             console.log(json.data[0].num);
//             sampleData.activePromotions = json.data[0].num;
//         } else {
//             console.error(json.message);
//         }
//     } catch (error) {
//         console.error('Error fetching products:', error);
//     }
// };

// const fetchPromosExpired = async (sampleData) => {
//     try {
//         let url = `http://localhost:5001/promotions/expiredCounts`;
//         const response = await fetch(url);
//         const json = await response.json();
//         if (json.response) {
//             console.log(json.data[0].num);
//             sampleData.expiredPromotions = json.data[0].num;
//         } else {
//             console.error(json.message);
//         }
//     } catch (error) {
//         console.error('Error fetching products:', error);
//     }
// };

// const fetchPromosAvgDollar = async (sampleData) => {
//     try {
//         const url = 'http://localhost:5001/promotions/avgDollar';
//         const response = await fetch(url);
//         const json = await response.json();

//         if (json.response) {
//             console.log(json.data[0].num);

//             const rate = json.data[0].rate;
//             const price = json.data[0].price;

//             if (rate === null || price === null) {
//                 sampleData.averageDollarDiscount = 0;
//             } else {
//                 const averageDollarDiscount = price * (rate * 0.01);
//                 sampleData.averageDollarDiscount = averageDollarDiscount;
//             }
//         } else {
//             console.error(json.message);
//         }
//     } catch (error) {
//         console.error('Error fetching promotions:', error);
//     }
// };


// const fetchPromosAvgPercent = async (sampleData) => {
//     try {
//         let url = `http://localhost:5001/promotions/avgPercent`;
//         const response = await fetch(url);
//         const json = await response.json();
//         if (json.response) {
//             console.log(json.data[0].num);
//             if (json.data[0].num == null){
//                 sampleData.averagePercentDiscount = 0;
//             }else{
//                 sampleData.averagePercentDiscount = json.data[0].num;
//             }
//         } else {
//             console.error(json.message);
//         }
//     } catch (error) {
//         console.error('Error fetching products:', error);
//     }
// };



// // Function to fetch data (simulated with sampleData for testing)
// async function fetchData() {
//     try {
//         // Simulate fetching data from an API
//         const data = sampleData;

//         await fetchPromosActive(data);
//         await fetchPromosExpired(data);
//         await fetchPromosAvgDollar(data);
//         await fetchPromosAvgPercent(data);
//         await fetchPromosCount(data);
//         await fetchAllPromo(data);

//         // Update UI with fetched data
//         document.getElementById('total-promotions').innerText = data.totalPromotions;
//         document.getElementById('active-promotions').innerText = data.activePromotions;
//         document.getElementById('expired-promotions').innerText = data.expiredPromotions;
//         document.getElementById('avgdollar-promotions').innerText = data.averageDollarDiscount;
//         document.getElementById('avgpercent-discount').innerText = `${data.averagePercentDiscount}%`;

//         // Populate user list
//         const userTableBody = document.getElementById('user-table-body');
//         data.promos.forEach(promo => {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td class="py-2 px-4 border-b">${promo.id}</td>
//                 <td class="py-2 px-4 border-b">${promo.name}</td>
//                 <td class="py-2 px-4 border-b">${promo.discount_rate}</td>
//                 <td class="py-2 px-4 border-b">${promo.start_date}</td>
//                 <td class="py-2 px-4 border-b">${promo.end_date}</td>
//             `;
//             userTableBody.appendChild(row);
//         });
       
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }


// // Fetch data and update dashboard on page load
// window.onload = fetchData;















document.addEventListener("DOMContentLoaded", function() {
    loadPromotions();
    loadPromotionsForSelects();
});

function showForm(formType) {
    hideForm();

    const formContainer = document.getElementById("crud-form-container");
    formContainer.classList.remove("hidden");

    let formTitle = "";
    switch (formType) {
        case "create":
            document.getElementById("create-form").classList.remove("hidden");
            formTitle = "Create Promotion";
            break;
        case "update":
            document.getElementById("update-form").classList.remove("hidden");
            formTitle = "Update Promotion";
            break;
        case "delete":
            document.getElementById("delete-form").classList.remove("hidden");
            formTitle = "Delete Promotion";
            break;
        case "send-email":
            document.getElementById("send-email-form").classList.remove("hidden");
            formTitle = "Send Promotion Email";
            break;
    }

    document.getElementById("crud-form-title").textContent = formTitle;
}

function hideForm() {
    const formContainer = document.getElementById("crud-form-container");
    formContainer.classList.add("hidden");

    const forms = formContainer.querySelectorAll("form > div");
    forms.forEach(form => form.classList.add("hidden"));
}


// Sample JSON data to simulate API response
const sampleData = {
    totalPromotions: 'Loading...',
    activePromotions: 'Loading...',
    expiredPromotions: 'Loading...',
    averagePercentDiscount: 'Loading...',
    averageDollarDiscount: 'Loading...',
    promos: [
        { id: 'Loading...', name: 'Loading...', discount_rate: 'Loading...', start_date: 'Loading...', end_date: 'Loading...' }
    ],
};

const fetchAllPromo = async (sampleData) => {
    try {
        let url = 'http://localhost:5001/allPromotions';
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log("promotion data: ", json.payload);
            sampleData.promos = json.payload;
        } else {
            console.error(json.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const fetchPromosCount = async (sampleData) => {
    try {
        let url = `http://localhost:5001/promotions/counts`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log(json.data[0].num);
            sampleData.totalPromotions = json.data[0].num;
        } else {
            console.error(json.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const fetchPromosActive = async (sampleData) => {
    try {
        let url = `http://localhost:5001/promotions/activeCounts`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log(json.data[0].num);
            sampleData.activePromotions = json.data[0].num;
        } else {
            console.error(json.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const fetchPromosExpired = async (sampleData) => {
    try {
        let url = `http://localhost:5001/promotions/expiredCounts`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log(json.data[0].num);
            sampleData.expiredPromotions = json.data[0].num;
        } else {
            console.error(json.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const fetchPromosAvgDollar = async (sampleData) => {
    try {
        const url = 'http://localhost:5001/promotions/avgDollar';
        const response = await fetch(url);
        const json = await response.json();

        if (json.response) {
            console.log(json.data[0].num);

            const rate = json.data[0].rate;
            const price = json.data[0].price;

            if (rate === null || price === null) {
                sampleData.averageDollarDiscount = 0;
            } else {
                const averageDollarDiscount = price * (rate * 0.01);
                sampleData.averageDollarDiscount = averageDollarDiscount;
            }
        } else {
            console.error(json.message);
        }
    } catch (error) {
        console.error('Error fetching promotions:', error);
    }
};


const fetchPromosAvgPercent = async (sampleData) => {
    try {
        let url = `http://localhost:5001/promotions/avgPercent`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log(json.data[0].num);
            if (json.data[0].num == null){
                sampleData.averagePercentDiscount = 0;
            }else{
                sampleData.averagePercentDiscount = json.data[0].num;
            }
        } else {
            console.error(json.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};



// Function to fetch data (simulated with sampleData for testing)
async function fetchData() {
    try {
        // Simulate fetching data from an API
        const data = sampleData;

        await fetchPromosActive(data);
        await fetchPromosExpired(data);
        await fetchPromosAvgDollar(data);
        await fetchPromosAvgPercent(data);
        await fetchPromosCount(data);
        await fetchAllPromo(data);

        // Update UI with fetched data
        document.getElementById('total-promotions').innerText = data.totalPromotions;
        document.getElementById('active-promotions').innerText = data.activePromotions;
        document.getElementById('expired-promotions').innerText = data.expiredPromotions;
        document.getElementById('avgdollar-promotions').innerText = data.averageDollarDiscount;
        document.getElementById('avgpercent-discount').innerText = `${data.averagePercentDiscount}%`;

        // Populate user list
        const userTableBody = document.getElementById('user-table-body');
        data.promos.forEach(promo => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-2 px-4 border-b">${promo.id}</td>
                <td class="py-2 px-4 border-b">${promo.name}</td>
                <td class="py-2 px-4 border-b">${promo.discount_rate}</td>
                <td class="py-2 px-4 border-b">${promo.start_date}</td>
                <td class="py-2 px-4 border-b">${promo.end_date}</td>
            `;
            userTableBody.appendChild(row);
        });
       
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


// Fetch data and update dashboard on page load
window.onload = fetchData;

function createPromotion() {
    const promotion = {
        name: document.getElementById("create-promo-name").value,
        description: document.getElementById("create-description").value,
        discountRate: document.getElementById("create-discount-rate").value,
        startDate: document.getElementById("create-start-date").value,
        endDate: document.getElementById("create-end-date").value
    };

    fetch("http://localhost:8080/admin/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promotion)
    })
        .then(response => {
            if (response.ok) {
                alert("Promotion created successfully");
                loadPromotions();
                loadPromotionsForSelects();
                hideForm();
            } else {
                alert("Failed to create promotion");
            }
        })
        .catch(error => console.error("Error creating promotion:", error));
}
// Function to update a promotion
function updatePromotion() {
    // Fetch values from the update form inputs
    const promoName = document.getElementById("update-promo-name").value;
    const description = document.getElementById("update-description").value;
    const discountRate = document.getElementById("update-discount-rate").value;
    const startDate = document.getElementById("update-start-date").value;
    const endDate = document.getElementById("update-end-date").value;

    // Construct the promotion object to send in the PUT request body
    const promotionData = {
        promoName: promoName,
        description: description,
        discountRate: discountRate,
        startDate: startDate,
        endDate: endDate
    };

    // Perform a PUT request to update the promotion
    fetch(`http://localhost:8080/admin/api/promotions`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(promotionData)
    })
        .then(response => {
            if (response.ok) {
                alert("Promotion updated successfully");
                hideForm();
                // Optionally, refresh or update the promotion list after update
                loadPromotions(); // Example function to reload promotions after update
            } else {
                alert("Failed to update promotion");
            }
        })
        .catch(error => console.error("Error updating promotion:", error));
}

// Function to delete a promotion
function deletePromotion() {
    // Fetch the selected promotion ID
    const promotionId = document.getElementById("delete-promo-select").value;

    // Perform a DELETE request to delete the promotion
    fetch(`http://localhost:8080/admin/api/promotions/${promotionId}`, {
        method: "DELETE",
    })
        .then(response => {
            if (response.ok) {
                alert("Promotion deleted successfully");
                hideForm();
                // Optionally, refresh or update the promotion list after deletion
                loadPromotions(); // Example function to reload promotions after deletion
            } else {
                alert("Failed to delete promotion");
            }
        })
        .catch(error => console.error("Error deleting promotion:", error));
}

// promom.js
async function sendEmail() {
    // Fetch email content from textarea
    const emailContent = document.getElementById("email-content").value;

    try {
        // Fetch recipient emails from your backend API
        const mailsResponse = await fetch('http://localhost:5001/users/getMails');
        const mailsJson = await mailsResponse.json();

        if (mailsResponse.ok) {
            // Extract emails from API response
            const mailsArray = mailsJson.data;
            console.log("emails", mailsArray)

            // Check if there are recipients found
            if (mailsArray.length === 0) {
                alert("No recipient emails found.");
                return;
            }

            // Send promotional email to recipients
            const response = await fetch(`http://127.0.0.1:5000/send-promotion`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: emailContent,
                    recipients: mailsArray
                })
            });

            const data = await response.json();
            if (response.ok && data.status) {
                alert("Email sent successfully!");
            } else {
                alert("Failed to send email.");
            }
        } else {
            // Handle error response from getMails endpoint
            alert(`Failed to fetch recipient emails: ${mailsJson.error || 'Unknown error'}`);
        }
    } catch (error) {
        // Handle fetch or JSON parsing errors
        alert(`Error: ${error.message}`);
    }
}


