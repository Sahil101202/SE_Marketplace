import requests
from faker import Faker

# Initialize Faker
fake = Faker()

# Endpoint for user registration
api_url = "http://localhost:5001/user/register"  # Change this to your actual API URL

# Generate and add 1000 users
for _ in range(1000):
    # Generate fake user data
    user_data = {
        "email": fake.email(),
        "phone": fake.phone_number(),
        "password": fake.password(),
        "name": fake.name(),
        "gender": fake.random_element(elements=('male', 'female', 'other')),
    }
    
    # Send POST request to register user
    response = requests.post(api_url, json=user_data)
    
    # Print response for debugging purposes
    print(response.status_code, response.json())

print("Completed adding 1000 users.")
