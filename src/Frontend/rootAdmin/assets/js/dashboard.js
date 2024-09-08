// Sample JSON data to simulate API response
const sampleData = {
    user: 'Loading...',
    conversion: 'Loading...',
    promotion: 'Loading...',
    activePromotion: 'Loading...',
    expiredPromotion: 'Loading...',
    product: 'Loading...',
    totalSales: 'Loading...',
    cat: [
        { name: 'Loading...' }
    ],
    orderHistory: [
        { id: 'Loading...', order_date: 'Loading...', order_total: 'Loading...', user_id: 'Loading...' },
    ],
};

const fetchProductsCount = async (sampleData) => {
    try {
        let url = `http://localhost:5001/products/counts`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log(json.data[0].num);
            sampleData.product = json.data[0].num;
        } else {
            console.error(json.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};


const fetchTotalSales = async (sampleData) => {
    try {
        let url = `http://localhost:5001/orders/total_order`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log(json.data[0].num);
            sampleData.totalSales = json.data[0].num;
        } else {
            console.error(json.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const fetchTotalCount = async (sampleData) => {
    try {
        let url = `http://localhost:5001/users/count`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log(json.data[0].num);
            sampleData.user = json.data[0].num;
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
            sampleData.promotion = json.data[0].num;
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
            sampleData.activePromotion = json.data[0].num;
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
            sampleData.expiredPromotion = json.data[0].num;
        } else {
            console.error(json.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const fetchConversion = async (sampleData) => {
    try {
        let url = `http://localhost:5001/users/conversion`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log('data :', json.data[0].totalUser , json.data[0].orderUser);
            sampleData.conversion = ( json.data[0].orderUser / json.data[0].totalUsers ) * 100;
            if (isNaN(sampleData.conversion)){
                sampleData.conversion = 0;
            }
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
            console.log(json.data);
            sampleData.cat = json.data;
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
            sampleData.orderHistory = json.data;
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

        await fetchProductsCount(data);
        await fetchTotalSales(data);
        await fetchTotalCount(data);
        await fetchPromosCount(data);
        await fetchPromosActive(data);
        await fetchPromosExpired(data);
        await fetchConversion(data);
        await fetchCategoies(data);
        await fetchRecentOrder(data);
        
        // Update UI with fetched data
        document.getElementById('user').innerText = data.user;
        document.getElementById('conversion').innerText = `${data.conversion}%`;
        document.getElementById('activePromotion').innerText = data.activePromotion;
        document.getElementById('expiredPromotion').innerText = data.expiredPromotion;
        document.getElementById('product').innerText = data.product;
        document.getElementById('promotion').innerText = data.promotion;
        document.getElementById('totalSales').innerText = data.totalSales;
        // document.getElementById('campaign-progress').innerText = "67%";
        // document.getElementById('campaign-spend').innerText = `$${data.campaign.spend}`;
        // document.getElementById('balance').innerText = `${data.balance.btc} BTC`;
        // document.getElementById('usd-balance').innerText = `USD $${data.balance.usd} | EUR ${data.balance.eur}`;

        // Populate user list
        const userTableBody = document.getElementById('cat-table-body');
        data.cat.forEach(category => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-2 px-4 border-b ">${category.name}</td>
            `;
            userTableBody.appendChild(row);
        });

        // Populate user list
        const order = document.getElementById('order-table-body');
        data.orderHistory.forEach(i => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-2 px-4 border-b ">${i.id}</td>
                <td class="py-2 px-4 border-b ">${i.order_date}</td>
                <td class="py-2 px-4 border-b ">${i.order_total}</td>
            `;
            order.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}



// Fetch data and update dashboard on page load
window.onload = fetchData;
