document.addEventListener("DOMContentLoaded", async () => {
    const token1 = localStorage.getItem("seller");

    if (token1) {
        document.addEventListener('header-loaded', async () => {
            try {
                console.log("Token:", token1);

                const arrayToken = token1.split('.');

                if (arrayToken.length !== 3) {
                    throw new Error("Invalid token format");
                }

                const tokenPayload = JSON.parse(atob(arrayToken[1]));
                console.log("Token Payload:", tokenPayload);

                const sellerId = tokenPayload.id;
                const sellerName = tokenPayload.name || "Seller";
                const sellerImage = tokenPayload.image || "http://localhost:8080/user/profile-default.png";

                document.getElementById("seller-name").textContent = sellerName;
                document.getElementById("user-image").src = sellerImage;

                const response = await fetch(`http://localhost:5001/seller/${sellerId}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch subscription details");
                }

                const data = await response.json();
                console.log("Subscription Data:", data.data);

                const subscriptionPlan = data.data.subscription_plan;

                manageSidebarFeatures(subscriptionPlan);
            } catch (error) {
                console.error("Error decoding token or fetching subscription details:", error);
            }
        });
    } else {
        window.location.href = "http://localhost:8080/login";
    }

    // // Pricing Model Modal Functionality
    // const pricingModelBtn = document.getElementById("pricing-model-btn");
    // const pricingModal = document.getElementById("pricing-modal");
    // const closePricingModal = document.querySelector(".close-pricing-modal");

    // pricingModelBtn.addEventListener("click", () => {
    //     console.log("Pricing model button clicked!");
    //     pricingModal.classList.remove("hidden");
    // });

    // closePricingModal.addEventListener("click", () => {
    //     pricingModal.classList.add("hidden");
    // });

    // Close modal when clicking outside of it
    // window.addEventListener("click", (event) => {
    //     if (event.target === pricingModal) {
    //         pricingModal.classList.add("hidden");
    //     }
    // });
});

function manageSidebarFeatures(subscriptionPlan) {
    disableAllFeatures();

    if (subscriptionPlan === 'Free') {
        enableFeature('Dashboard');
        enableFeature('Product Management');
        strikeThroughFeature('User Management');
        strikeThroughFeature('Order Management');
        strikeThroughFeature('Promotions Management');
    } else if (subscriptionPlan === 'Basic') {
        enableFeature('Dashboard');
        enableFeature('Product Management');
        enableFeature('Order Management');
        strikeThroughFeature('User Management');
        strikeThroughFeature('Promotions Management');
    } else if (subscriptionPlan === 'Pro') {
        enableFeature('Dashboard');
        enableFeature('Product Management');
        enableFeature('Order Management');
        enableFeature('User Management');
        strikeThroughFeature('Promotions Management');
    } else if (subscriptionPlan === 'Premium') {
        enableAllFeatures();
    }
}

function disableAllFeatures() {
    const allFeatures = document.querySelectorAll('.navbar a');
    allFeatures.forEach(feature => {
        feature.classList.add('disabled');
        strikeThroughFeature(feature.textContent.trim());
    });
}

function enableFeature(featureName) {
    const featureClass = `.feature-${featureName.toLowerCase().replace(' ', '-')}`;
    const feature = document.querySelector(featureClass);

    if (feature) {
        feature.classList.remove('disabled');
        feature.style.textDecoration = 'none';  // Remove strikethrough if the feature is enabled
    } else {
        console.warn(`Feature not found: ${featureName}`);
    }
}

function strikeThroughFeature(featureName) {
    const featureClass = `.feature-${featureName.toLowerCase().replace(' ', '-')}`;
    const feature = document.querySelector(featureClass);

    if (feature) {
        feature.style.textDecoration = 'line-through';
        feature.style.color = 'gray';  // Optional: You can change the text color to make it more evident
    }
}

function enableAllFeatures() {
    const allFeatures = document.querySelectorAll('.navbar a');
    allFeatures.forEach(feature => {
        feature.classList.remove('disabled');
        feature.style.textDecoration = 'none';  // Remove strikethrough for all features
    });
}


// document.getElementById("pricing-model-btn").addEventListener("click", () => {
//     console.log("pricing modal clicked !!!!");
//     document.getElementById("pricing-modal").classList.remove("hidden");
// });

// document.querySelector(".close-pricing-modal").addEventListener("click", () => {
//     document.getElementById("pricing-modal").classList.add("hidden");
// });
