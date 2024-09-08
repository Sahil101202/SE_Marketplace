fetch('http://localhost:8080/php/cars.php')
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
        const container = document.querySelector('.pro-container');

        cars = data.data;
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
})
.catch(error => console.error('Error fetching data:', error));

//to add in the cart
function addToCart(model, token){
    const arrayData = {
        "model" : model,
        "token" : token
    };
    //converting array to jason object
    var data = JSON.stringify(arrayData);

    fetch('http://localhost:8080/php/add_to_cart.php', {
        method : 'POST',
        headers : {
            'content-Type' : 'application/json'
        },
        body : data
    })
    .then(response => {
        console.log(response.status);

        if(response.ok){
            return response.json();
        }else{
            throw new Error('Network response was not ok.');
        }
    })
    .then(data => {
        if(data.success){
            alert(data.message);
        }else if(data.reason === "token"){
            alert("Login Required to have Favourite Cars.");
            window.location.href = '../html/login.html';
        }else{
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
