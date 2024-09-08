// Sample JSON data to simulate API response
const sampleData = {
    salesRate: '75%',
    productsAvailable: 1200,
    totalUsers: 1500,
    ordersPlaced: 300,
    itemsInCarts: 450,
    conversionRate: '60%',
    charts: {
        salesOverTime: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [10000, 15000, 20000, 25000, 30000, 35000]
        },
        topProducts: {
            labels: ['Product A', 'Product B', 'Product C', 'Product D'],
            data: [1200, 1500, 1800, 2000]
        },
        userGrowth: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [200, 400, 600, 800, 1000, 1200]
        },
        ordersByCategory: {
            labels: ['Category A', 'Category B', 'Category C', 'Category D'],
            data: [100, 150, 200, 250]
        }
    }
};

// Function to fetch data (simulated with sampleData for testing)
async function fetchData() {
    try {
        // Simulate fetching data from an API
        const data = sampleData;

        // Update UI with fetched data
        document.getElementById('sales-rate').innerText = data.salesRate;
        document.getElementById('products-available').innerText = data.productsAvailable;
        document.getElementById('total-users').innerText = data.totalUsers;
        document.getElementById('orders-placed').innerText = data.ordersPlaced;
        document.getElementById('items-in-carts').innerText = data.itemsInCarts;
        document.getElementById('conversion-rate').innerText = data.conversionRate;

        // Update charts
        updateCharts(data.charts);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to update charts with new data
function updateCharts(chartData) {
    // Sales Over Time Chart
    var ctx1 = document.getElementById('salesOverTimeChart').getContext('2d');
    new Chart(ctx1, {
        type: 'line',
        data: {
            labels: chartData.salesOverTime.labels,
            datasets: [{
                label: 'Sales',
                data: chartData.salesOverTime.data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Top Products Chart
    var ctx2 = document.getElementById('topProductsChart').getContext('2d');
    new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: chartData.topProducts.labels,
            datasets: [{
                label: 'Products',
                data: chartData.topProducts.data,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // User Growth Chart
    var ctx3 = document.getElementById('userGrowthChart').getContext('2d');
    new Chart(ctx3, {
        type: 'line',
        data: {
            labels: chartData.userGrowth.labels,
            datasets: [{
                label: 'Users',
                data: chartData.userGrowth.data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Orders by Category Chart
    var ctx4 = document.getElementById('ordersByCategoryChart').getContext('2d');
    new Chart(ctx4, {
        type: 'pie',
        data: {
            labels: chartData.ordersByCategory.labels,
            datasets: [{
                label: 'Orders',
                data: chartData.ordersByCategory.data,
                backgroundColor: [
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false
        }
    });
}

// Fetch data and update dashboard on page load
window.onload = fetchData;
