function clicker(container, car) {
    // Add click event listener to each car container
    container.addEventListener('click', function () {
        // Get the selected model from the clicked container
        const selectedModel = car.model;
        console.log(selectedModel);

        // Set the company name in the second feat-title
        document.getElementById("title").getElementsByTagName("h2")[0].innerText = car.brand.charAt(0).toUpperCase() + car.brand.slice(1) + " " + selectedModel.charAt(0).toUpperCase() + selectedModel.slice(1);

        // Clear the previous data in pro-container
        const container = document.querySelector('.pro-container');
        container.innerHTML = '';

        const carContainer = document.getElementById('car-details');
        carContainer.innerHTML = '';

        // You can perform additional actions with the selected model
        // For example, load details, navigate to a new page, etc.
        loadDetailsForModel(selectedModel);
    });
}


function loadDetailsForModel(model) {
    const arrayData = {
        "model" : model
    };
    //converting array to jason object
    var data = JSON.stringify(arrayData);
                
    fetch('http://localhost:8080/php/car_detail.php', {
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

            const token1 = localStorage.getItem("token_user");

            console.log(data);
            carDetails = data.data;

            carDetails.forEach(car => {    
                const detailsContainer = document.getElementById('car-details');
                detailsContainer.innerHTML = '';

                const carImage = document.createElement('img');
                carImage.src = 'data:image/jpeg;base64,' + car.image;
                carImage.alt = ' Image Is Not Available';
                detailsContainer.appendChild(carImage);


                const headLine = document.createElement('div');
                headLine.classList.add('mp');

                const modelprice = document.createElement('div');
                modelprice.classList.add('left');

                const modelHeader = document.createElement('div');
                modelHeader.classList.add('model');
                modelHeader.textContent = car.model.charAt(0).toUpperCase() + car.model.slice(1);
                modelprice.appendChild(modelHeader);

                const price = document.createElement('div');
                price.classList.add('price');
                price.textContent = '$' + ' ' + car.price;
                modelprice.appendChild(price);
                headLine.appendChild(modelprice);

                const cart = document.createElement('div');
                cart.classList.add('cart_btn');
            
                const btn = document.createElement('button');
                btn.innerText = 'Add to Favorites';
                btn.setAttribute("onclick", "addToCart('" + car.model + "', '" + token1 + "')");
                cart.appendChild(btn);
                headLine.appendChild(cart);
                detailsContainer.appendChild(headLine);

                const detail = document.createElement('div');
                detail.classList.add('detail');

                const head = document.createElement('h2');
                head.textContent = 'Details';
                detail.appendChild(head);

                const topSpeedPara = document.createElement('div');
                const ts1 = document.createElement('p');
                ts1.textContent = 'Top Speed';
                const ts2 = document.createElement('p');
                ts2.textContent = car.top_speed + ' KM/H';
                topSpeedPara.appendChild(ts1);
                topSpeedPara.appendChild(ts2);
                detail.appendChild(topSpeedPara);

                const accelerationPara = document.createElement('div');
                const ac1 = document.createElement('p');
                ac1.textContent = '0-100 km/h';
                const ac2 = document.createElement('p');
                ac2.textContent = car['0-100'] + ' Seconds';
                accelerationPara.appendChild(ac1);
                accelerationPara.appendChild(ac2);
                detail.appendChild(accelerationPara);

                const driveTypePara = document.createElement('div');
                const dt1 = document.createElement('p');
                dt1.textContent = 'Drive Type';
                const dt2 = document.createElement('p');
                dt2.textContent = car.drive_type;
                driveTypePara.appendChild(dt1);
                driveTypePara.appendChild(dt2);
                detail.appendChild(driveTypePara);

                const horsepowerPara = document.createElement('div');
                const hp1 = document.createElement('p');
                hp1.textContent = 'Horsepower';
                const hp2 = document.createElement('p');
                hp2.textContent = car.horsepower + ' HP';
                horsepowerPara.appendChild(hp1);
                horsepowerPara.appendChild(hp2);
                detail.appendChild(horsepowerPara);

                const powerPara = document.createElement('div');
                const p1 = document.createElement('p');
                p1.textContent = 'Power';
                const p2 = document.createElement('p');
                p2.textContent = car.power;
                powerPara.appendChild(p1);
                powerPara.appendChild(p2);
                detail.appendChild(powerPara);

                const ccPara = document.createElement('div');
                const c1 = document.createElement('p');
                c1.textContent = 'CC';
                const c2 = document.createElement('p');
                c2.textContent = car.cc;
                ccPara.appendChild(c1);
                ccPara.appendChild(c2);
                detail.appendChild(ccPara);

                const fuelTypePara = document.createElement('div');
                const ft1 = document.createElement('p');
                ft1.textContent = 'Fuel Type';
                const ft2 = document.createElement('p');
                ft2.textContent = car.fuel_type;
                fuelTypePara.appendChild(ft1);
                fuelTypePara.appendChild(ft2);
                detail.appendChild(fuelTypePara);

                const lengthPara = document.createElement('div');
                const l1 = document.createElement('p');
                l1.textContent = 'Length';
                const l2 = document.createElement('p');
                l2.textContent = car.length + ' mm';
                lengthPara.appendChild(l1);
                lengthPara.appendChild(l2);
                detail.appendChild(lengthPara);

                const widthPara = document.createElement('div');
                const w1 = document.createElement('p');
                w1.textContent = 'Width';
                const w2 = document.createElement('p');
                w2.textContent = car.width + ' mm';
                widthPara.appendChild(w1);
                widthPara.appendChild(w2);
                detail.appendChild(widthPara);

                const heightPara = document.createElement('div');
                const h1 = document.createElement('p');
                h1.textContent = 'Height';
                const h2 = document.createElement('p');
                h2.textContent = car.hight + ' mm';
                heightPara.appendChild(h1);
                heightPara.appendChild(h2);
                detail.appendChild(heightPara);

                const weightPara = document.createElement('div');
                const we1 = document.createElement('p');
                we1.textContent = 'Weight';
                const we2 = document.createElement('p');
                we2.textContent = car.weight + ' Kg';
                weightPara.appendChild(we1);
                weightPara.appendChild(we2);
                detail.appendChild(weightPara);

                detailsContainer.appendChild(detail);
            });
    })
    .catch(error => console.error('Error fetching data:', error));
}