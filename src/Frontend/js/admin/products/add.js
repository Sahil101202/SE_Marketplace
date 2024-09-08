const myForm = document.querySelector('.form');
const token1 = localStorage.getItem("token_admin");
console.log(token1);

myForm.addEventListener('submit', event =>{
    //to prevent default event of refrecing page while submitting the form
    event.preventDefault();
    //now getting the data from the form
    const formData = new FormData(myForm);
    const arrayData = {
        "token" : token1,
        "model" : formData.get('model'),
        "company" : formData.get('company'),
        "model_year" : formData.get('year'),
        "price" : formData.get('price'),
        "max_speed" : formData.get('speed'),
        "s0_100" : formData.get('time'),
        "fuel_type" : formData.get('fueltype'),
        "drive_type" : formData.get('drivetype'),
        "horse_power" : formData.get('hp'),
        "power" : formData.get('power'),
        "cc" : formData.get('cc'),
        "length" : formData.get('len'),
        "width" : formData.get('wid'),
        "higth" : formData.get('hig'),
        "weight" : formData.get('weight'),
    };
    //converting array to jason object
    var data = JSON.stringify(arrayData);

    fetch('http://localhost:8080/php/admin/products/add.php', {
        method : 'POST',
        headers : {
            'content-Type' : 'application/json'
        },
        body : data
    })
    .then(response => {
        console.log(response.status); // Log the status code
        return response.json(); // or response.json() if you want to see the entire response
    })
    .then(data => {
        // Log the parsed JSON response
        console.log(data);

        // Check if registration was successful
        if (data.success) {
            // Redirect to the login page
            alert("Car Added Successfuly!!!!!");
            window.location.href = '../../../html/admin/products/add.html';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});



