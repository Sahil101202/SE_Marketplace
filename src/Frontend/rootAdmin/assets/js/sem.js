// Sample JSON data to simulate API response
const sampleData = {
    totalSellers: 'Loading...',
    averageOrderValue: 'Loading...',
    totalRevenue: 'Loading...',
    charts: {
        orderTrends: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [150, 300, 450, 600, 750, 900]
        },
        orderStatus: {
            labels: ['Pending', 'Completed', 'Cancelled'],
            data: [200, 900, 100]
        }
    },
    recentOrders: [
        { id: 'Loading...', name: 'Loading...', product: 'Loading...' }
    ]
};

const fetchTotalSellers = async (sampleData) => {
    try {
        let url = `http://localhost:5001/seller/count`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log("seller count",json.data[0].num);
            sampleData.totalSellers = json.data[0].num;
        } else {
            console.error(json.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};


const fetchSellerData = async (sampleData) => {
    try {
        let url = `http://localhost:5001/sellers_data`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log("seller data", json.payload);
            sampleData.recentOrders = json.payload;
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

        await fetchTotalSellers(data);
        await fetchSellerData(data);

        // Update UI with fetched data
        document.getElementById('total-orders').innerText = data.totalSellers;

        // Populate recent order list
        const recentOrderTable = document.getElementById('order-table-body');
        data.recentOrders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-2 px-4 border-b">${order.id}</td>
                <td class="py-2 px-4 border-b">${order.name}</td>
                <td class="py-2 px-4 border-b">${order.num}</td>
            `;
            recentOrderTable.appendChild(row);
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


// Fetch data and update dashboard on page load
window.onload = fetchData;
