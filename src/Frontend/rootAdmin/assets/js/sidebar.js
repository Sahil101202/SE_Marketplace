document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("admin");

    if (token) {
        document.addEventListener('header-loaded', () => {
            try {
                console.log("Token:", token);
                
                const arrayToken = token.split('.');
                
                if (arrayToken.length !== 3) {
                    throw new Error("Invalid token format");
                }

                const tokenPayload = JSON.parse(atob(arrayToken[1]));
                console.log("Token Payload:", tokenPayload);
                
                const sellerName = "ADMIN";
                const sellerImage = tokenPayload.image || "http://localhost:8080/user/profile-default.png";

                document.getElementById("seller-name").textContent = sellerName;
                document.getElementById("user-image").src = sellerImage;

            } catch (error) {
                console.error("Error decoding token:", error);
            }
        });
    } else {
        window.location.href = "http://localhost:8080/login";
    }
});
