document.addEventListener('DOMContentLoaded', async () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal-value');
    const totalElement = document.getElementById('total-value');
    

    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const arrayToken = token.split('.');
            const tokenPayload = JSON.parse(atob(arrayToken[1]));
            const userId = tokenPayload.id;
            localStorage.setItem('user_id', userId);
            const response = await fetch(`http://localhost:5001/cart/${userId}`);
            const data = await response.json();
            console.log("respose",data);
            if (data.response) {
                console.log(data.payload);
                return data.payload;
            } else {
                console.error(data.message);
                return [];
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
            return [];
        }
    };

    const calculateTotal = (items) => {
        return items.reduce((total, item) => total + item.price * item.qty, 0);
    };

    const displayCartItems = async (items) => {
        var total = 0;
        cartItemsContainer.innerHTML = '';
        for (const item of items) {
            total = total + item.price;
            try {
                const imageResponse = await fetch(`http://localhost:5001/products/image/${item.product_item_id}`);
                const imageResult = await imageResponse.json();
                let imageUrl = 'placeholder-image-url'; // Default placeholder image
    
                if (imageResult.response) {
                    imageUrl = `data:image/jpeg;base64,${imageResult.data}`;
                }
    
                const cartItemRow = document.createElement('tr');
                cartItemRow.innerHTML = `
                    <td class="py-2 px-4 border-b"><a href="#" class="remove-item" data-id=${item.id}><i class="far fa-times-circle"></i></a></td>
                    <td class="py-2 px-4 border-b"><img src="${imageUrl}" alt="${item.product_name}" class="w-20 h-20 object-cover"></td>
                    <td class="py-2 px-4 border-b">${item.product_name}</td>
                    <td class="py-2 px-4 border-b">$ ${item.price.toFixed(2)}</td>
                    <td class="py-2 px-4 border-b"><input type="number" value="${item.qty}" class="quantity-input w-full border rounded px-2 py-1" data-id=${item.id} product-id=${item.product_item_id}></td>
                    <td class="py-2 px-4 border-b">$ ${(item.price * item.qty).toFixed(2)}</td>
                `;
                cartItemsContainer.appendChild(cartItemRow);
            } catch (error) {
                console.error('Error fetching image:', error);
                const cartItemRow = document.createElement('tr');
                cartItemRow.innerHTML = `
                    <td class="py-2 px-4 border-b"><a href="#" class="remove-item" data-id="${item.id}"><i class="far fa-times-circle"></i></a></td>
                    <td class="py-2 px-4 border-b"><img src="placeholder-image-url" alt="${item.product_name}" class="w-20 h-20 object-cover"></td>
                    <td class="py-2 px-4 border-b">${item.product_name}</td>
                    <td class="py-2 px-4 border-b">$ ${item.price.toFixed(2)}</td>
                    <td class="py-2 px-4 border-b"><input type="number" value="${item.qty}" class="quantity-input w-full border rounded px-2 py-1" data-id=${item.id} product-id=${item.product_item_id}"></td>
                    <td class="py-2 px-4 border-b">$ ${(item.price * item.qty).toFixed(2)}</td>
                `;
                cartItemsContainer.appendChild(cartItemRow);
            }
        }
    
        const subtotal = calculateTotal(items);
        subtotalElement.textContent = `$ ${subtotal.toFixed(2)}`;
        totalElement.textContent = `$ ${subtotal.toFixed(2)}`;
    
        // Add event listeners for remove buttons and quantity inputs
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                const itemId = button.getAttribute('data-id');
                console.log("remove", itemId);
                await removeItemFromCart(itemId);
                const updatedItems = await fetchCartItems();
                displayCartItems(updatedItems);
            });
        });
    
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', async (e) => {
                const itemId = input.getAttribute('data-id');
                const productId = input.getAttribute('product-id');
                console.log("update", itemId);
                const newQuantity = parseInt(input.value);
                console.log("qty", newQuantity);
                console.log("product", productId);
                await updateItemQuantity(itemId, productId, newQuantity);
                const updatedItems = await fetchCartItems();
                displayCartItems(updatedItems);
            });
        });
    };
    

    const removeItemFromCart = async (itemId) => {
        console.log("remove", `http://localhost:5001/cart/remove/${itemId}`);
        try {
            await fetch(`http://localhost:5001/cart/remove/${itemId}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const updateItemQuantity = async (itemId, productId, quantity) => {
        const arrayData1 = {
            "qty": quantity,
            "product_item_id": productId
        };
        var data1 = JSON.stringify(arrayData1);
        console.log(data1);
    
        try {
            const response = await fetch(`http://localhost:5001/cart/update/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: data1
            });
            const jsonResponse = await response.json();
            console.log(jsonResponse);
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    // document.querySelectorAll('.checkout').forEach(button => {
    //     button.addEventListener('click', async (e) => {
    //         window.location.href = "http://localhost:8080/checkOut/check_out.html";
    //     });
    // });

    
    
    const cartItems = await fetchCartItems();
    console.log("var", cartItems);
    displayCartItems(cartItems);
});

document.addEventListener('DOMContentLoaded', async () => {
    // Elements
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutBtn = checkoutModal.querySelector('.close-btn');
    const cartSummaryContainer = document.getElementById('cart-summary');
    const userAddressContainer = document.getElementById('user-address');
    const addAddressBtn = document.getElementById('add-address-btn');
    const placeOrderBtn = document.getElementById('place-order-btn');

    const addressModal = document.getElementById('address-modal');
    const closeAddressBtn = addressModal.querySelector('.close-address-btn');
    const addressForm = document.getElementById('address-form');

    // Event Listeners
    checkoutBtn.addEventListener('click', openCheckoutModal);
    closeCheckoutBtn.addEventListener('click', closeCheckoutModal);
    window.addEventListener('click', handleOutsideClick);
    addAddressBtn.addEventListener('click', openAddressModal);
    closeAddressBtn.addEventListener('click', closeAddressModal);
    addressForm.addEventListener('submit', handleAddressFormSubmit);
    placeOrderBtn.addEventListener('click', handlePlaceOrder);

    // Functions
    async function openCheckoutModal() {
        try {
            await fetchAndDisplayCartSummary();
            await fetchAndDisplayUserAddresses();
            checkoutModal.style.display = 'flex';
        } catch (error) {
            console.error('Error opening checkout modal:', error);
        }
    }

    function closeCheckoutModal() {
        checkoutModal.style.display = 'none';
    }

    function handleOutsideClick(event) {
        if (event.target === checkoutModal) {
            closeCheckoutModal();
        } else if (event.target === addressModal) {
            closeAddressModal();
        }
    }

    function openAddressModal() {
        addressModal.style.display = 'flex';
    }

    function closeAddressModal() {
        addressModal.style.display = 'none';
    }

    async function handleAddressFormSubmit(event) {
        event.preventDefault();

        const newAddress = {
            street_number: document.getElementById('street-number').value,
            postal_code: document.getElementById('postal-code').value,
            address_line: document.getElementById('address-line').value,
            city: document.getElementById('city').value,
            region: document.getElementById('region').value,
            country: document.getElementById('country').value
        };

        try {
            const address = await addUserAddress(newAddress);
            // displayUserAddresses([address], userAddressContainer);
            fetchAndDisplayUserAddresses();
            closeAddressModal();
        } catch (error) {
            console.error('Error adding new address:', error);
            alert('Failed to add new address. Please try again later.');
        }
    }

    async function handlePlaceOrder() {
        const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        const selectedAddress = document.querySelector('input[name="address"]:checked').value;
        const orderTotal = document.querySelector('strong[name="total"]').getAttribute("value");

        try {
            const cartItems = await fetchCartSummary();
            const userData = await fetchProfileData();
            console.log("cart_item", cartItems);
            console.log("user_data", userData);
            const arrayData = {
                email : userData.email,
                products : cartItems
            };
            var data = JSON.stringify(arrayData);
            if (selectedPaymentMethod === 'cod') {
                await placeOrder(selectedAddress, selectedPaymentMethod, orderTotal);
                const response = await fetch('http://127.0.0.1:5000/send-email', {
                    method : 'POST',
                    headers : {
                        'content-Type' : 'application/json'
                    },
                    body : data
                });
                const json = await response.json();
                if (json.status){
                    alert('Order placed successfully!');
                    window.location.href = 'http://localhost:8080/';
                }
            } else {
                if (await redirectToStripe()) {
                    await redirectToStripe();
                    await placeOrder(selectedAddress, selectedPaymentMethod, orderTotal);
                    const response = await fetch('http://127.0.0.1:5000/send-email', {
                        method : 'POST',
                        headers : {
                            'content-Type' : 'application/json'
                        },
                        body : data
                    });
                    const json = await response.json();
                    if (json.status){
                        alert('Order placed successfully!');
                        window.location.href = 'http://localhost:8080/';
                    }
                }
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again later.');
        }
    }

    // Data Fetching and Display
    async function fetchAndDisplayCartSummary() {
        try {
            const cartItems = await fetchCartSummary();
            displayCartSummary(cartItems, cartSummaryContainer);
        } catch (error) {
            console.error('Error fetching cart summary:', error);
            cartSummaryContainer.innerHTML = '<p>Unable to load cart summary. Please try again later.</p>';
        }
    }

    async function fetchAndDisplayUserAddresses() {
        try {
            const addresses = await fetchUserAddresses();
            displayUserAddresses(addresses, userAddressContainer);
            addAddressBtn.style.display = 'block'; // Always show the add address button
        } catch (error) {
            console.error('Error fetching user addresses:', error);
            userAddressContainer.innerHTML = '<p>Unable to load addresses. Please try again later.</p>';
            addAddressBtn.style.display = 'block';
        }
    }

    async function fetchCartSummary() {
        const user_id = localStorage.getItem('user_id');
        const response = await fetch(`http://localhost:5001/cart/summary/${user_id}`);
        if (!response.ok) throw new Error('Failed to fetch cart summary');
        const cartItems = await response.json();
        return cartItems.payload;
    }

    function displayCartSummary(cartItems, container) {
        container.innerHTML = '';
        cartItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.innerHTML = `
                <p class="py-2 px-4 border-b">${item.name} - $${item.price.toFixed(2)} x ${item.qty}</p>
            `;
            container.appendChild(itemElement);
        });

        const total = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
        const totalElement = document.createElement('p');
        totalElement.innerHTML = `<strong class="py-2 px-4 border-b" name="total" value="${total.toFixed(2)}">Total: $${total.toFixed(2)}</strong>`;
        container.appendChild(totalElement);
    }

    async function fetchUserAddresses() {
        const response = await fetch(`http://localhost:5001/users/addresses/${localStorage.getItem("user_id")}`);
        if (!response.ok) throw new Error('Failed to fetch user addresses');
        const addresses = await response.json();
        return addresses.data;
    }

    function displayUserAddresses(addresses, container) {
        container.innerHTML = '';
        addresses.forEach(address => {
            const addressElement = document.createElement('label');
            addressElement.innerHTML = `
                <input type="radio" name="address" value="${address.id}"> 
                ${address.street_number}, ${address.address_line}, ${address.city}, ${address.region}, ${address.country} - ${address.postal_code}
            `;
            container.appendChild(addressElement);
        });

        if (addresses.length === 1) {
            document.querySelector('input[name="address"]').checked = true;
        }
    }

    async function addUserAddress(address) {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            console.error('User ID is not available in localStorage.');
            throw new Error('User ID is not available');
        }
    
        const url = `http://localhost:5001/users/add_address/${userId}`;
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(address)
        };
    
        try {
            const response = await fetch(url, requestOptions);
            // if (response.ok) {
            //     const errorDetail = await response.json();
            //     throw new Error(`Failed to add new address: ${errorDetail.message}`);
            // }
            const result = await response.json();
            if(result.response){
                alert(result.message);
                // return result.data;
            }
        } catch (error) {
            console.error('Error adding user address:', error);
            throw error;
        }
    }
    

    async function placeOrder(address, paymentMethod, orderTotal) {
        const cart_data = await fetchCartSummary();
        const response = await fetch('http://localhost:5001/orders/place', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                address_id: parseInt(address),
                payment: paymentMethod,
                user_id: localStorage.getItem('user_id'),
                order_total: parseFloat(orderTotal),
                products: cart_data
            })
        });
        if (!response.ok) throw new Error('Failed to place order');
    }

    async function redirectToStripe() {
        try {
            // Fetch cart data
            const cart_data = await fetchCartSummary();
            console.log("cart data", cart_data);
    
            // Send request to create Stripe session
            const response = await fetch('http://localhost:5001/stripe/create-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: cart_data })
            });
    
            // Check for HTTP response status
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to create Stripe session: ${errorText}`);
            }
    
            // Parse response
            const session = await response.json();
            console.log("Stripe session data", session);
    
            // Initialize Stripe and redirect to checkout
            const stripe = Stripe('pk_test_51PUYzSDxa2xNsUeM0Y06IAQDrVnDURhP6tEXB13cBsdOG6H0pZeRZOHBYQyjBMGdFy29D5aIvyb3wfH5JkYZVkgt00Ek8O6SHr');
            const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
    
            // Handle Stripe redirect errors
            if (error) {
                console.error('Error redirecting to Stripe checkout:', error);
            }
        } catch (error) {
            // General error handling
            console.error('Error creating Stripe session:', error);
        }
    }
    

    async function fetchProfileData() {
        const token = localStorage.getItem("authToken");
    
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.id;
    
            try {
                const response = await fetch(`http://localhost:5001/user/profile/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                const data = await response.json();
                if (data.response) {
                    return data.payload[0];
                } else {
                    console.error('Failed to fetch profile data.');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            console.error('No token found.');
        }
    }
});
