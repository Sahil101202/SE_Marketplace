document.addEventListener('header-loaded', () => {
    console.log('Header loaded event received');
    const navbar = document.getElementById('navbar');
    if (!navbar) {
        console.error('Navbar element not found after header loaded');
        return;
    }
    console.log('Navbar element found:', navbar);

    const token1 = localStorage.getItem("authToken");
    console.log(token1);
    const arrayData = { "token": token1 };
    const data = JSON.stringify(arrayData);

    function updateNavigationBar(isLoggedIn) {
        const registerLink = document.querySelector('a[href="http://localhost:8080/user/register.html"]');
        const loginLink = document.querySelector('a[href="http://localhost:8080/user/login.html"]');

        if (isLoggedIn) {
            if (registerLink) registerLink.parentElement.remove();
            if (loginLink) loginLink.parentElement.remove();

            const profileLink = document.createElement('li');
            const logoutLink = document.createElement('li');
            const cartLink = document.createElement('li');

            profileLink.innerHTML = '<a href="http://localhost:8080/user/profile.html">Profile</a>';
            logoutLink.innerHTML = '<a id="logout-btn" href="#">Logout</a>';
            cartLink.innerHTML = '<a href="http://localhost:8080/cart/cart.html"><i class="far fa-shopping-bag"></i></a>';

            navbar.appendChild(profileLink);
            navbar.appendChild(logoutLink);
            navbar.appendChild(cartLink);
        }
    }

    function checkTokenValidity(token) {
        if (!token) {
            return false;
        }

        try {
            const arrayToken = token.split('.');
            const tokenPayload = JSON.parse(atob(arrayToken[1]));
            console.log(tokenPayload);
            role_id = tokenPayload.role_id;
            console.log(new Date().getTime());
            console.log(Math.floor(new Date().getTime() / 1000) <= tokenPayload.exp);
            if (role_id == 2){
                return false;
            }
            return Math.floor(new Date().getTime() / 1000) <= tokenPayload.exp;

        } catch (error) {
            console.error('Error decoding token:', error);
            return false;
        }
    }

    if (checkTokenValidity(token1)) {
        updateNavigationBar(true);
    } else {
        updateNavigationBar(false);
    }


    const logoutBtn = document.getElementById('logout-btn');
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
    if(role_id !== 2){
        localStorage.removeItem("authToken");
    }
    window.location.href = "http://localhost:8080/";
}
