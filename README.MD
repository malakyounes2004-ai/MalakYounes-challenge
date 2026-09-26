
# Malak Store

Malak Store is a full-stack perfume e-commerce application featuring a customer storefront and an admin dashboard.

## Features

### Customer Storefront
- Browse perfumes and filter by category
- View product details and prices
- Add products to a shopping cart
- Update quantities and remove items
- Place orders through checkout
- View order confirmation

### Admin Dashboard
- Admin login
- Dashboard overview
- Manage products and categories
- Upload product images
- View and manage customer orders

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Authentication:** JWT

## Project Structure

```text
webdevCHALLENGE/
├── backend/       # Express API
├── client/        # React frontend
└── database/      # SQL schema
```

## Local Setup

### 1. Database
Create a MySQL database and import `database/schema.sql`.

### 2. Backend
```bash
cd backend
npm install
```

Configure the required environment variables in `backend/.env`, then start the backend using the script defined in `backend/package.json`.

### 3. Frontend
```bash
cd client
npm install
npm run dev
```

The frontend uses the backend API for products, categories, authentication, and orders.

## Security

Environment files, dependencies, build output, and local uploads are excluded from Git using `.gitignore`.

## Author

Malak Younes
