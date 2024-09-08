document.addEventListener('DOMContentLoaded', function () {
    fetchProfileData();
});

const sampleData = {
    recentOrders: [
        { id: 'Loading...', orderDate: 'Loading...', orderTotal: 'Loading...', orderStatus: 'Loading...' }
    ]
};

async function fetchProfileData() {
    const token = localStorage.getItem("authToken");

    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;

        try {
            const response = await fetch(`http://localhost:5001/user/profile/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data.response) {
                displayProfileData(data.payload[0]);
            } else {
                console.error('Failed to fetch profile data.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        console.error('No token found.');
    }
}

function displayProfileData(user) {
    document.getElementById('profileName').textContent = `${user.name}`;
    document.getElementById('profileAvatar').src = user.avatar ? user.avatar : 'profile-default.png';

    document.getElementById('profileNameData').textContent = `${user.name}`;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileGender').textContent = user.gender || 'Not specified';
    document.getElementById('profileContact').textContent = user.phone || 'Not specified';

    fetchOrderHistory(user.id);
}

async function fetchOrderHistory(userId) {
    const token = localStorage.getItem("authToken");

    try {
        const response = await fetch(`http://localhost:5001/orders/recent/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.response) {
            sampleData.recentOrders = data.data;
            displayOrderHistory(sampleData.recentOrders);
        } else {
            console.error('Failed to fetch order history.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayOrderHistory(orders) {
    const orderHistoryContainer = document.getElementById('orderHistory');
    if (orders.length === 0) {
        orderHistoryContainer.innerHTML = '<tr><td colspan="4">No orders found.</td></tr>';
        return;
    }
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="py-2 px-4 border-b">${order.id}</td>
            <td class="py-2 px-4 border-b">${order.order_date}</td>
            <td class="py-2 px-4 border-b">${order.order_status}</td>
            <td class="py-2 px-4 border-b">${order.order_total}</td>
        `;
        orderHistoryContainer.appendChild(row);
    });
}

// Edit Profile Functionality
const editProfileBtn = document.getElementById('editProfile');
const editProfileForm = document.getElementById('editProfileForm');
const cancelEditBtn = document.getElementById('cancelEdit');
const profileForm = document.getElementById('profileForm');

editProfileBtn.addEventListener('click', () => {
    editProfileForm.classList.remove('hidden');
});

cancelEditBtn.addEventListener('click', () => {
    editProfileForm.classList.add('hidden');
});

profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");

    if (!token) {
        console.error('No token found.');
        return;
    }

    const updatedProfile = {
        name: document.getElementById('editName').value,
        email: document.getElementById('editEmail').value,
        gender: document.getElementById('editGender').value,
        phone: document.getElementById('editContact').value
    };

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;

        const response = await fetch(`http://localhost:5001/user/update/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedProfile)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.response) {
            alert('Profile updated successfully');
            fetchProfileData(); // Refresh profile data after update
            editProfileForm.classList.add('hidden');
        } else {
            console.error('Failed to update profile.');
            alert('Failed to update profile. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update profile. Please try again.');
    }
});