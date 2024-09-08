document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const categoryId = params.get('category_id');
    
    
    const defaultProduct = {
        id: productId,
        name: 'Loading...',
        brand: 'Loading...',
        price: 0.00,
        stock: 'Loading...',
        seller: 'Loading...',
        image: '',
        sizes: ['Loading...', 'Loading...', 'Loading...'],
        specifications: [
            "No Description"
        ]
    };

    const updateProductDetails = (product) => {
        document.getElementById('product-name').textContent = product[2] || defaultProduct.name;
        document.getElementById('product-brand').textContent = `Brand: ${product[5] || defaultProduct.brand}`;
        document.getElementById('product-price').textContent = `$${(product[4] || defaultProduct.price).toFixed(2)}`;
        document.getElementById('product-stock').textContent = `Stock: ${product[3] || defaultProduct.stock}`;
        document.getElementById('product-seller').textContent = `Sold By: ${product[5] || defaultProduct.seller}`;

        const specsContainer = document.querySelector('.list-disc');
        specsContainer.innerHTML = '';
        (product.specifications || defaultProduct.specifications).forEach(spec => {
            const li = document.createElement('li');
            li.textContent = spec;
            specsContainer.appendChild(li);
        });
    };

    const updateDescription = (product) => {
        const container = document.getElementById('productdescription');
        if (container) {
            container.innerText = product[6] || 'No description available';
        } else {
            console.error("Element with id 'productdescription' not found");
        }
    };
    
    const updateProductSizes = (sizes) => {
        const sizesContainer = document.querySelector('.size.flex.space-x-2');
        sizesContainer.innerHTML = '';
        sizes.forEach(size => {
            const button = document.createElement('button');
            button.className = 'px-4 py-2 border rounded-lg';
            button.textContent = size;
            sizesContainer.appendChild(button);
        });
    };

    const updateImageContainers = (imageSrc) => {
        document.getElementById('product-image').src = imageSrc;
        const smallImageContainers = document.querySelectorAll('.small-image-container');
        smallImageContainers.forEach(container => {
            container.src = imageSrc;
            container.addEventListener('click', () => {
                document.getElementById('product-image').src = imageSrc;
            });
        });
    };

    const fetchProductImage = async () => {
        try {
            const response = await fetch(`http://localhost:5001/products/image/${productId}`);
            if (!response.ok) throw new Error('Failed to fetch product image');
            const imageData = await response.json();
            if (imageData?.data) {
                const imageSrc = `data:image/jpeg;base64,${imageData.data}`;
                updateImageContainers(imageSrc);
            }
        } catch (error) {
            console.error('Error fetching product image:', error);
        }
    };

    const fetchProductSizes = async () => {
        try {
            const response = await fetch(`http://localhost:5001/products/sizes/${categoryId}`);
            if (!response.ok) throw new Error('Failed to fetch product sizes');
            const sizesData = await response.json();
            if (sizesData?.sizes) {
                updateProductSizes(sizesData.sizes);
            } else {
                console.error('Sizes data is missing in the API response');
                updateProductSizes(defaultProduct.sizes);
            }
        } catch (error) {
            console.error('Error fetching product sizes:', error);
            updateProductSizes(defaultProduct.sizes);
        }
    };

    const loadProductDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5001/products/${productId}`);
            if (!response.ok) throw new Error('Failed to fetch product details');
            const product = await response.json();
            if (product?.data) {
                updateProductDetails(product.data[0]);
                updateDescription(product.data[0]);
            } else {
                console.error('Product data is missing in the API response');
                updateProductDetails(defaultProduct);
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
            updateProductDetails(defaultProduct);
        }
    };

    const checkUserLogin = () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const decodedToken = jwt_decode(token);
                const tokenExpiry = decodedToken.exp * 1000; // Convert expiry time to milliseconds
                const currentTime = Date.now();
                return currentTime < tokenExpiry;
            } catch (error) {
                console.error('Error decoding token:', error);
                return false;
            }
        }
        return false;
    };
    

    const addToCart = async (product) => {
        console.log("cart data product", product);
        if (checkUserLogin()) {
            try {
                const token = localStorage.getItem('authToken');
                const decodedToken = jwt_decode(token);
                const userId = decodedToken.id;
                console.log("inside the container");
                const arrayData = {
                    "user_id" : userId,
                    "product_item_id" : productId,
                    "qty" : 1
                };
                //converting array to jason object
                var data = JSON.stringify(arrayData);
                console.log("cart data", data);
                const response = await fetch('http://localhost:5001/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: data,
                });
    
                if (response.ok) {
                    alert('Product added to cart!');
                } else {
                    const errorData = await response.json();
                    console.error('Error adding to cart:', errorData);
                    alert('Failed to add product to cart.');
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                alert('An error occurred while adding the product to the cart.');
            }
        } else {
            alert('Login Required');
        }
    };
    

    const init = async () => {
        updateProductDetails(defaultProduct);
        await loadProductDetails();
        await fetchProductImage();
        await fetchProductSizes();

        // Add event listener for "Add to Cart" button
        document.getElementById('add-to-cart-button').addEventListener('click', addToCart);
    };

    init();
});
