// Sample JSON data to simulate API response
const sampleData = {
    totalOrders: 'Loading...',
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
        { id: 'Loading...', order_date: 'Loading...', order_total: 'Loading...', user_id: 'Loading...' }
    ]
};

const fetchTotalOrder = async (sampleData) => {
    try {
        let url = `http://localhost:5001/orders/total_order`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log(json.data[0].num);
            sampleData.totalOrders = json.data[0].num;
        } else {
            console.error(json.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const fetchAvgPrice = async (sampleData) => {
    try {
        let url = `http://localhost:5001/orders/avgOrderPrice`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log(json.data[0].num);
            if (json.data[0].num == null){
                sampleData.averageOrderValue = 0.0;
            }else{
                sampleData.averageOrderValue = json.data[0].num;
            }
            
        } else {
            console.error(json.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const fetchTotalRevenue = async (sampleData) => {
    try {
        let url = `http://localhost:5001/orders/totalRevenue`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log(json.data[0].num);
            if (json.data[0].num == null){
                sampleData.totalRevenue = 0.0;
            }else{
                sampleData.totalRevenue = json.data[0].num;
            }
        } else {
            console.error(json.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const fetchRecentOrder = async (sampleData) => {
    try {
        let url = `http://localhost:5001/orders/recent_order`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log(json.data);
            sampleData.recentOrders = json.data;
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

        await fetchTotalOrder(data);
        await fetchAvgPrice(data);
        await fetchTotalRevenue(data);
        await fetchRecentOrder(data);

        // Update UI with fetched data
        document.getElementById('total-orders').innerText = data.totalOrders;
        document.getElementById('average-order-value').innerText = `$${data.averageOrderValue.toLocaleString()}`;
        document.getElementById('total-revenue').innerText = `$${data.totalRevenue.toLocaleString()}`;

        // Populate recent order list
        const recentOrderTable = document.getElementById('order-table-body');
        data.recentOrders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-2 px-4 border-b">${order.id}</td>
                <td class="py-2 px-4 border-b">${order.user_id}</td>
                <td class="py-2 px-4 border-b">${order.order_date}</td>
                <td class="py-2 px-4 border-b">${order.order_total}</td>
                
            `;
            recentOrderTable.appendChild(row);
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


// Fetch data and update dashboard on page load
window.onload = fetchData;
