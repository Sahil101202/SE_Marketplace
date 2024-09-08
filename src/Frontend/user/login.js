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

    const response = await fetch('http://localhost:5001/user/login', {
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
            if(json.key == 'admin'){
                const token = json.token;
                localStorage.setItem(json.key, token);
                window.location.href = "http://localhost:8080/rootAdmin/app/index.html";
                alert(json.message);
            }else if(json.key == 'user'){
                const token = json.token;
                localStorage.setItem("authToken", token);
                window.location.href = "http://localhost:8080/";
                alert(json.message);
            }
        }
    }
    // .then(response => {
    //     console.log(response.status);
    //     console.log(response.json());
    // })
    // .then(data => {
    //     console.log(data);

    //     if(data.response){
    //         if(data.message == "Admin Login successful!"){
    //             // const token1 = data.token;
    //             // localStorage.setItem("token_admin", token1);
    //             // // Redirect to the admin page
    //             // window.location.href = '../html/admin/dashboard.html';
    //             alert("Admin Login Successful!!");
    //         }else{
    //             // const token1 = data.token;
    //             // console.log(token1);
    //             // localStorage.setItem("token_user", token1);
    //             // Redirect to the user page
    //             // window.location.href = '../html/index.html';
    //             alert("Login Successful!!");
    //         }
    //     }else{
    //         alert(data.message);
    //     }
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    // });
});