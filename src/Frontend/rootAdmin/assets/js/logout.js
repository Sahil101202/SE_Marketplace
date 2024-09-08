document.addEventListener('header-loaded', () => {
    const logoutBtn = document.querySelector('.logout');
    const logoutModal = document.getElementById('logout-modal');
    const closeLogoutBtn = logoutModal.querySelector('.close-logout-btn');
    const confirmLogoutBtn = document.getElementById('confirm-logout-btn');
    const cancelLogoutBtn = document.getElementById('cancel-logout-btn');
    // Open logout modal
    logoutBtn.addEventListener('click', () => {
        logoutModal.style.display = 'flex';
    });

    // Close logout modal when clicking on the close button
    closeLogoutBtn.addEventListener('click', () => {
        logoutModal.style.display = 'none';
    });

    // Close logout modal when clicking outside of the modal content
    window.addEventListener('click', (event) => {
        if (event.target == logoutModal) {
            logoutModal.style.display = 'none';
        }
    });

    // Confirm logout
    confirmLogoutBtn.addEventListener('click', () => {
        logout();
        alert('You have been logged out.'); // Replace this with actual logout functionality
        logoutModal.style.display = 'none';
    });

    // Cancel logout
    cancelLogoutBtn.addEventListener('click', () => {
        logoutModal.style.display = 'none';
    });
});



// Function to simulate logging out
function logout() {
    localStorage.removeItem("authToken");
    window.location.href = "http://localhost:8080/";
}
