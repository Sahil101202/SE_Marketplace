document.addEventListener('DOMContentLoaded', function () {
    // Fetch user profile data from PHP API
    fetchProfileData();
});

function fetchProfileData() {
    const token1 = localStorage.getItem("token_user");
    const arrayData = {
        "token" : token1,
    };
    //converting array to JSON object
    var data = JSON.stringify(arrayData);

    // Assuming your PHP API endpoint for profile data is profile_api.php
    fetch('http://localhost:5001/user/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data,
    })
    .then(response => response.json())
    .then(data => {
        // Check if the API response is successful
        if (data.success) {
            // Display the user profile data
            displayProfileData(data.data);
        } else {
            console.error('Failed to fetch profile data.');
        }
    })
    .catch(error => console.error('Error:', error));
}

function displayProfileData(user) {
    const profileDataContainer = document.getElementById('profileData');

    // Create HTML content to display user profile data
    const profileHTML = `
        <h2>Welcome, ${user.name}!</h2>
        <table>
            <tbody>
                <tr>
                    <td>Name</td>
                    <td>:</td>
                    <td>${user.name +" "+ user.surname}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>:</td>
                    <td>${user.email}</td>
                </tr>
                <tr>
                    <td>Gender</td>
                    <td>:</td>
                    <td>${user.gender}</td>
                </tr>
                <tr>
                    <td>Contact</td>
                    <td>:</td>
                    <td>${user.phone}</td>
                </tr>
                <tr>
                    <td>Country</td>
                    <td>:</td>
                    <td>${user.country}</td>
                </tr>
                <tr>
                    <td>Birth Date</td>
                    <td>:</td>
                    <td>${user.birth_date}</td>
                </tr>
            </tbody>
        </table>
        
    `;

    // Set the content of the profileDataContainer
    profileDataContainer.innerHTML = profileHTML;
}


                
