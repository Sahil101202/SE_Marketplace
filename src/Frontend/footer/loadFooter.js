document.addEventListener("DOMContentLoaded", function() {
    fetch("http://localhost:8080/footer/footer.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector("footer").innerHTML = data;
        })
        .catch(error => console.error("Error loading footer:", error));
});
