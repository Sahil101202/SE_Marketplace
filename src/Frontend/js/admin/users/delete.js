
const myForm = document.querySelector('.form');
const token1 = localStorage.getItem("token_admin");
console.log(token1);

myForm.addEventListener('submit', event =>{
    event.preventDefault();
    //getting the data from the form
    const formData = new FormData(myForm);
    const arrayData = {
        "token" : token1,
        "email" : formData.get('email'),
        "birth_date" : formData.get('dob')
    }; 
    //converting array to jason object
    var data = JSON.stringify(arrayData);
    
    fetch('http://localhost:8080/php/admin/users/delete.php', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: data
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
        console.log('Parsed JSON:', data);
        // Check if deletation was successful
        if (data.success) {
            // Redirect to the delete page
            alert("User Deleted Successfuly!!!!!");
            window.location.href = '../../../html/admin/users/delete.html';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});



