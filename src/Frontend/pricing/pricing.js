document.addEventListener("DOMContentLoaded", () => {
    const togglePlan = document.getElementById("toggle-plan");
    const freePlanDuration = document.getElementById("free-plan-duration");
    const proPlanPrice = document.getElementById("pro-plan-price");
    const proPlanDuration = document.getElementById("pro-plan-duration");
    const premierPlanPrice = document.getElementById("premier-plan-price");
    const premierPlanDuration = document.getElementById("premier-plan-duration");

    // Function to check if the user is logged in by validating the token expiry
    const checkUserLogin = () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const arrayToken = token.split('.');
            if (arrayToken.length !== 3) {
                return false; // Invalid token format
            }

            const tokenPayload = JSON.parse(atob(arrayToken[1]));
            const currentTime = Math.floor(Date.now() / 1000);

            return tokenPayload.exp && currentTime < tokenPayload.exp;
        }
        return false;
    };

    // Function to get sellerId from the token
    const getSellerIdFromToken = () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const arrayToken = token.split('.');
            const tokenPayload = JSON.parse(atob(arrayToken[1]));
            return tokenPayload.id;
        }
        return null;
    };

    // Function to handle subscription logic
    const handleSubscription = async (planName) => {
        const sellerId = getSellerIdFromToken();
        if (!sellerId) {
            alert("Error: Unable to fetch seller ID.");
            return;
        }

        const confirmation = confirm(`Are you sure you want to subscribe to the ${planName} plan?`);

        if (confirmation) {
            try {
                const response = await fetch(`http://localhost:5001/api/seller/${sellerId}/subscription`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    },
                    body: JSON.stringify({
                        subscription_plan: planName
                    })
                });

                if (!response.ok) {
                    throw new Error("Failed to update the subscription plan.");
                }

                const data = await response.json();
                alert(`Successfully subscribed to the ${planName} plan.`);
                console.log("Subscription Data:", data);

            } catch (error) {
                console.error("Error during subscription:", error);
                alert("An error occurred while processing your subscription. Please try again.");
            }
        }
    };

    // Toggle plan event listener
    togglePlan.addEventListener("change", function () {
        if (this.checked) {
            // Yearly plan
            freePlanDuration.textContent = "yr";
            proPlanPrice.textContent = "$80";
            proPlanDuration.textContent = "yr";
            premierPlanPrice.textContent = "$200";
            premierPlanDuration.textContent = "yr";
        } else {
            // Monthly plan
            freePlanDuration.textContent = "mo";
            proPlanPrice.textContent = "$8";
            proPlanDuration.textContent = "mo";
            premierPlanPrice.textContent = "$20";
            premierPlanDuration.textContent = "mo";
        }
    });

    // Adding click event listeners for subscription buttons
    const subscriptionButtons = document.querySelectorAll(".subscribe-button");

    subscriptionButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (checkUserLogin()) {
                const planName = button.getAttribute('data-plan-name');
                handleSubscription(planName);
            } else {
                alert("Seller login required to subscribe to a plan.");
            }
        });
    });
});
