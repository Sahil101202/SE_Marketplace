const myForm = document.querySelector('.form');

myForm.addEventListener('submit', event =>{
    //to prevent default event of refrecing page while submitting the form
    event.preventDefault();
    //now getting the data from the form
    const formData = new FormData(myForm);
    const arrayData = {
        "name" : formData.get('name'),
        "surname" : formData.get('surname'),
        "birth_date" : formData.get('bd'),
        "country" : formData.get('country'),
        "gender" : formData.get('gender'),
        "phone" : formData.get('phone'),
        "email" : formData.get('email'),
        "password" : formData.get('psw'),
        "repeat_password" : formData.get('psw_repeat')
    };
    //converting array to jason object
    var data = JSON.stringify(arrayData);

    fetch('http://localhost:8080/php/register.php', {
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
            alert("User Added Successfuly!!!!!");
            window.location.href = '../../../html/admin/users/add.html';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});



