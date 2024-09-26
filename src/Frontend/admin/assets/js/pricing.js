// Ensure the DOM is fully loaded before adding event listeners
document.addEventListener("DOMContentLoaded", function() {
    // Get all the subscribe buttons
    const subscribeButtons = document.querySelectorAll(".subscribe-button");

    // Get token from localStorage and decode it
    const token = localStorage.getItem('seller');
    if (!token) {
        console.error("No token found in localStorage");
        return;
    }

    const arrayToken = token.split('.');
    if (arrayToken.length !== 3) {
        console.error("Invalid token format");
        return;
    }

    let tokenPayload;
    try {
        tokenPayload = JSON.parse(atob(arrayToken[1]));
        console.log("Token Payload:", tokenPayload);
    } catch (error) {
        console.error("Failed to decode token:", error);
        return;
    }

    const sellerId = tokenPayload.id;
    if (!sellerId) {
        console.error("Seller ID not found in token payload");
        return;
    }

    // Add event listeners to all subscribe buttons
    subscribeButtons.forEach(button => {
        button.addEventListener("click", function() {
            // Get the selected plan name from the data attribute
            const selectedPlan = this.getAttribute("data-plan-name");
            console.log(`Selected Plan: ${selectedPlan}`);

            // Optional: Add a confirmation before proceeding
            const confirmSelection = confirm(`Are you sure you want to subscribe to the ${selectedPlan} plan?`);
            if (!confirmSelection) return;

            // Prepare the API URL and the seller ID
            const apiUrl = `http://localhost:5001/seller/pricing/${sellerId}`;

            // Create the payload to send to the API
            const payload = {
                plan: selectedPlan
            };

            // Send the selected plan to the backend via POST request
            fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Pass the token in the Authorization header if required
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                console.log("API Response Status:", response.status);
                if (!response.ok) {
                    // If the server responded with an error
                    return response.json().then(errData => {
                        throw new Error(errData.message || "Failed to change subscription");
                    });
                }
                return response.json();
            })
            .then(data => {
                // Handle success response from API
                alert(data.message);
                console.log("API Response:", data);
            })
            .catch(error => {
                // Handle any errors that occur during the fetch
                console.error("Error occurred during API call:", error);
                alert(`Error: ${error.message}`);
            });
        });
    });
});
