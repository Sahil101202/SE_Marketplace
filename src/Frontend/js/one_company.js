
document.addEventListener('DOMContentLoaded', function () {
    // Get all elements with class 'fe-box-brands'
    var brandBoxes = document.querySelectorAll('.fe-box-brands');

    // Add click event listener to each brand box
    brandBoxes.forEach(function (brandBox) {
        brandBox.addEventListener('click', function () {
            // Extract company name from the clicked element
            var companyName = brandBox.querySelector('h6').innerText;
            console.log(companyName);

            // Set the company name in the second feat-title
            document.getElementById("title").getElementsByTagName("h2")[0].innerText = companyName + " Cars";

            // Clear the previous data in pro-container
            const container = document.querySelector('.pro-container');
            container.innerHTML = '';

            const carContainer = document.getElementById('car-details');
            carContainer.innerHTML = '';

            // Simulate loading cars for the selected brand
            loadCarsForBrand(companyName);
        });
    });
});


// Function to simulate loading cars for the selected brand
function loadCarsForBrand(brand) {

    const arrayData = {
        "brand" : brand
    };
    //converting array to jason object
    var data = JSON.stringify(arrayData);
                
    fetch('http://localhost:8080/php/one_company.php', {
        method : 'POST',
        headers : {
            'content-Type' : 'application/json'
        },
        body : data
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const container = document.querySelector('.pro-container');

        cars = data.data;

        if(cars.length > 0 ){
            cars.forEach(car => {
                const carContainer = document.createElement('div');
                carContainer.classList.add('pro');
                clicker(carContainer, car);
                
                const carLink = document.createElement('a');
                
                const carImage = document.createElement('img');
                carImage.src = 'data:image/jpeg;base64,' + car.image;
                carImage.alt = 'Image Is Not Available';
                
                const descriptionContainer = document.createElement('div');
                descriptionContainer.classList.add('des');
                
                const brandSpan = document.createElement('span');
                brandSpan.textContent = car.brand.charAt(0).toUpperCase() + car.brand.slice(1);
                
                const modelHeader = document.createElement('h5');
                modelHeader.textContent = car.model.charAt(0).toUpperCase() + car.model.slice(1);
                
                // Append elements to the structure
                carLink.appendChild(carImage);
                descriptionContainer.appendChild(brandSpan);
                descriptionContainer.appendChild(modelHeader);
                carContainer.appendChild(carLink);
                carContainer.appendChild(descriptionContainer);
                
                // Append the new car container to the main container
                container.appendChild(carContainer);
            });
        }else{
            const carContainer = document.getElementById('car-details');
            carContainer.innerHTML = '';
        }
    })
    .catch(error => console.error('Error fetching data:', error));
    
};


