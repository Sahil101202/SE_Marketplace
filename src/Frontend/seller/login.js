const myForm = document.querySelector('.form');

myForm.addEventListener('submit', async event =>{
    event.preventDefault();
    //now getting the data from the form
    const formData = new FormData(myForm);
    const arrayData = {
        "email" : formData.get('email'),
        "password" : formData.get('psw')
    };
    //converting array to jason object
    var data = JSON.stringify(arrayData);
    localStorage.setItem('user_email', formData.get('email'));

    const response = await fetch('http://localhost:5001/seller/login', {
        method : 'POST',
        headers : {
            'content-Type' : 'application/json'
        },
        body : data
    })
    const json = await response.json();
    console.log("json: ", json);

    if (json){
        if (json.response){
            if(json.key == 'seller'){
                const token = json.token;
                localStorage.setItem(json.key, token);
                window.location.href = "http://localhost:8080/admin/app/index.html";
                alert(json.message);
            }else{
                alert("Error ! Please try agin !");
            }
        }
    }
});