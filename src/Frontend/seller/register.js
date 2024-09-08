const myForm = document.querySelector('.form');

myForm.addEventListener('submit', async event =>{
    //to prevent default event of refrecing page while submitting the form
    event.preventDefault();
    //now getting the data from the form
    const formData = new FormData(myForm);
    if (formData.get('psw') == formData.get('psw_repeat')){
        arrayData = {
            "name" : formData.get('name'),
            "email" : formData.get('email'),
            "password" : formData.get('psw'),
            "description" : formData.get('description'),
        };
    }else{
        alert('Password and Repeat Password are not same');
    }
    //converting array to jason object
    var data = JSON.stringify(arrayData);

    const response = await fetch('http://localhost:5001/seller/register', {
        method : 'POST',
        headers : {
            'content-Type' : 'application/json'
        },
        body : data
    })

    const json = await response.json();
    console.log(json);

    if (json){
        if (json.response){
            alert(json.message);
        }
    }

    // .then(response => {
    //     console.log(response.status); // Log the status code
    //     // return response.json(); // or response.json() if you want to see the entire response
    // })
    // .then(data => {
    //     // Log the parsed JSON response
    //     console.log(data);

    //     // Check if registration was successful
    //     if (data.response) {
    //         alert("register successfully!!!!!");
    //         // Redirect to the login page
    //         window.location.href = 'http://localhost:5001/user/login';
            
    //     } else {
    //         alert(data.message);
    //     }
    // })
    // // .catch(error => {
    // //     console.error('Error:', error);
    // // });
});



