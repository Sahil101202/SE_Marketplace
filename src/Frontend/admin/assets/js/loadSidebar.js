document.addEventListener("DOMContentLoaded", function() {
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        fetch('http://localhost:8080/admin/assets/html/sidebar.html')
            .then(response => response.text())
            .then(data => {
                headerContainer.innerHTML = data;
                document.dispatchEvent(new Event('header-loaded'));

                // Initialize modal functionality after loading the sidebar
                initializeModalFunctionality();
            })
            .catch(error => console.error('Error loading header:', error));
    }
});

function initializeModalFunctionality() {
    const pricingModelBtn = document.getElementById("pricing-model-btn");
    const pricingModal = document.getElementById("pricing-modal");
    const closeModalBtn = document.querySelector(".close-pricing-modal");

    if (pricingModelBtn && pricingModal && closeModalBtn) {
        // Ensure the modal is hidden initially
        pricingModal.classList.add("hidden");

        // Open the modal when the button is clicked
        pricingModelBtn.addEventListener("click", () => {
            pricingModal.classList.remove("hidden");
            document.body.classList.add("overflow-hidden"); // Prevent background scrolling
        });

        // Close the modal when the close button is clicked
        closeModalBtn.addEventListener("click", () => {
            pricingModal.classList.add("hidden");
            document.body.classList.remove("overflow-hidden"); // Allow background scrolling
        });

        // Close the modal when clicking outside of it
        pricingModal.addEventListener("click", (event) => {
            if (event.target === pricingModal) {
                pricingModal.classList.add("hidden");
                document.body.classList.remove("overflow-hidden");
            }
        });
    }
}
