// Sample JSON data to simulate API response
let sampleData = {
    totalUsers: 'Loading...',
    activeUsers: 'Loading...',
    maleUsers: 'Loading...',
    femaleUsers: 'Loading...',
    users: [
        { id: 'Loading...', name: 'Loading...', email: 'Loading...', gender: 'Loading...', phone: 'Loading...' }
    ],
};

const fetchTotalCount = async (sampleData) => {
    try {
        let url = `http://localhost:5001/users/count`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log(json.data[0].num);
            sampleData.totalUsers = json.data[0].num;
        } else {
            console.error(json.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const fetchMaleCount = async (sampleData) => {
    try {
        let url = `http://localhost:5001/users/male_count`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log(json.data[0].num);
            sampleData.maleUsers = json.data[0].num;
        } else {
            console.error(json.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const fetchFemaleCount = async (sampleData) => {
    try {
        let url = `http://localhost:5001/users/female_count`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log(json.data[0].num);
            sampleData.femaleUsers = json.data[0].num;
        } else {
            console.error(json.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const fetchAllUser = async (sampleData) => {
    try {
        let url = `http://localhost:5001/users/all_user_data`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log(json.data);
            sampleData.users = json.data;
        } else {
            console.error(json.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const fetchActiveCount = async (sampleData) => {
    try {
        let url = `http://localhost:5001/users/active_count`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.response) {
            console.log(json.data[0].num);
            sampleData.activeUsers = json.data[0].num;
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

        await fetchActiveCount(data);
        await fetchFemaleCount(data);
        await fetchMaleCount(data);
        await fetchTotalCount(data);
        await fetchAllUser(data);

        // Update UI with fetched data
        document.getElementById('total-users').innerText = data.totalUsers;
        document.getElementById('male-users').innerText = data.maleUsers;
        document.getElementById('female-users').innerText = data.femaleUsers;
        document.getElementById('active-users').innerText = data.activeUsers;

        // Populate user list
        const userTableBody = document.getElementById('user-table-body');
        data.users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-2 px-4 border-b">${user.id}</td>
                <td class="py-2 px-4 border-b">${user.name}</td>
                <td class="py-2 px-4 border-b">${user.email}</td>
                <td class="py-2 px-4 border-b">${user.gender}</td>
                <td class="py-2 px-4 border-b">${user.phone}</td>
            `;
            userTableBody.appendChild(row);
        });
       
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}



// Fetch data and update dashboard on page load
window.onload = fetchData;
