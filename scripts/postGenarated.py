import os
import random
import subprocess
from faker import Faker

# Initialize Faker for generating random data
fake = Faker()

# Function to generate random data for a patient
def generate_patient_data():
    full_name = fake.name()
    admin = random.choice([True, False])
    email = fake.email()
    phone = fake.phone_number()[:15]
    age = random.randint(18, 90)
    gender = random.choice(['Male', 'Female', 'Other'])
    amount = round(random.uniform(50.0, 1000.0), 2)
    price = round(random.uniform(50.0, 1000.0), 2)
    status = random.choice(['Paid', 'Pending', 'Cancel'])
    payment_date = fake.date_between(start_date='-1y', end_date='today')
    
    return {
        'FullName': full_name,
        'admin': admin,
        'email': email,
        'phone': phone,
        'age': age,
        'gender': gender,
        'amount': amount,
        'price': price,
        'status': status,
        'PaymentDate': str(payment_date),
    }

# Loop to generate 100 patients and send a POST request via curl
for i in range(10):
    patient_data = generate_patient_data()
    
    # Form the curl command
    curl_command = f"""
    curl -X POST http://localhost:5000/api/patients \
    -H "Content-Type: application/json" \
    -d '{{
        "FullName": "{patient_data['FullName']}",
        "admin": {str(patient_data['admin']).lower()},
        "email": "{patient_data['email']}",
        "phone": "{patient_data['phone']}",
        "age": {patient_data['age']},
        "gender": "{patient_data['gender']}",
        "amount": {patient_data['amount']},
        "price": {patient_data['price']},
        "status": "{patient_data['status']}",
        "PaymentDate": "{patient_data['PaymentDate']}"
    }}'
    """

    # Run the curl command
    os.system(curl_command)
