const token = localStorage.getItem("token_user");
const cartArrayData = {
    "token" : token,
};
//converting array to JSON object
var cartData = JSON.stringify(cartArrayData);

fetch('http://localhost:8080/php/cart.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: cartData
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    const container = document.querySelector('.cars_cart');

    cars = data.data;
    var total = 0;

    if(cars.length > 0 ){
        cars.forEach(car => {
            const carContainer = document.createElement('div');
            carContainer.classList.add('car');

            const carImage = document.createElement('img');
            carImage.src = 'data:image/jpeg;base64,' + car.image;
            carImage.alt = 'Image Is Not Available';
            carContainer.appendChild(carImage);

            const dContainer = document.createElement('div');
            dContainer.classList.add('dcont');

            const descriptionContainer = document.createElement('div');
            descriptionContainer.classList.add('des');
    
            const brandSpan = document.createElement('span');
            brandSpan.textContent = car.brand.charAt(0).toUpperCase() + car.brand.slice(1);
            descriptionContainer.appendChild(brandSpan);
    
            const modelHeader = document.createElement('h5');
            modelHeader.textContent = car.model.charAt(0).toUpperCase() + car.model.slice(1);
            descriptionContainer.appendChild(modelHeader);

            const price = document.createElement('h3');
            price.textContent = "$" + car.price;
            total += parseFloat(car.price);
            descriptionContainer.appendChild(price);
            dContainer.appendChild(descriptionContainer);

            const cart = document.createElement('div');
            cart.classList.add('rmv_btn');
            
            const btn = document.createElement('button');
            btn.innerText = 'Remove Car';
            btn.setAttribute("onclick", "deleteFromCart('" + car.model + "', '" + token + "')");
            cart.appendChild(btn);
            dContainer.appendChild(cart);
            carContainer.appendChild(dContainer);

            container.appendChild(carContainer);
        });

        const tprice = document.getElementById('total');
        tprice.innerHTML = "$  " + total;

    }else{
        const carContainer = document.getElementById('cars_cart');
        carContainer.innerHTML = '';
    }
})
.catch(error => console.error('Error fetching data:', error));


function deleteFromCart(model, token){
    const arrayData = {
        "model" : model,
        "token" : token
    };
    //converting array to jason object
    var data = JSON.stringify(arrayData);

    fetch('http://localhost:8080/php/delete_from_cart.php', {
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
            window.location.href = '../html/cart.html';
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
};



function check_out(){
    fetch('http://localhost:8080/php/check_out.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: cartData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Log the parsed JSON response
        console.log(data);

        // Check if registration was successful
        if (data.success) {
            // Redirect to the login page
            window.location.href = '../html/index.html';
            alert(data.message);
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
};
 

