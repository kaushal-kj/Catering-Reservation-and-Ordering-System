# Catering Reservation and Ordering System

A full-stack web application that streamlines catering services by providing an intuitive platform for customers to browse menus, place orders, and make reservations while enabling administrators to manage their catering business efficiently. Built with modern web technologies to deliver a seamless experience for both customers and service providers.

## 🌟 Features

### Customer Features
- **User Registration & Authentication** - Secure account creation and login system
- **Menu Browsing** - Interactive menu with detailed dish descriptions and pricing
- **Order Placement** - Easy-to-use ordering system with customizable options
- **Order History** - View past orders and reorder favorite items

### Admin Features
- **Menu Management** - Add, edit, and remove menu items with categories
- **Order Management** - View, process, and update order statuses

## 🚀 Demo

🔗 [Live Demo](https://cater-ease-kk.vercel.app/)

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface and component management
- **React Router** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **Redux/Context API** - State management

### Backend
- **Node.js** - Server-side runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing and security
- **Multer** - File upload handling for images

### Additional Technologies
- **Nodemailer** - Email notifications
- **Cloudinary** - Image storage and optimization

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. Clone the repository:
git clone https://github.com/kaushal-kj/Catering-Reservation-and-Ordering-System.git \
cd Catering-Reservation-and-Ordering-System



2. Navigate to server directory:
cd server



3. Install server dependencies:
npm install



4. Create a `.env` file in the server directory: \
PORT=5000 \
MONGO_URI=your_mongodb_connection_string \
JWT_SECRET=your_jwt_secret_key \
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name \
CLOUDINARY_API_KEY=your_cloudinary_api_key \
CLOUDINARY_API_SECRET=your_cloudinary_api_secret \
EMAIL_USER=your_email_for_notifications \
EMAIL_PASS=your_email_password \
CLIENT_URL=http://localhost:5173



5. Start the backend server:
npm start

or for development
npm run dev



### Frontend Setup

1. Navigate to client directory:
cd client



2. Install client dependencies:
npm install



3. Create a `.env` file in the client directory:
VITE_BACKEND_URL=http://localhost:5000/api



4. Start the frontend development server:
npm start



The application will be available at `http://localhost:5173`

## 🖥️ Usage

### For Customers
1. **Register/Login** - Create an account or sign in to existing account
2. **Browse Menu** - Explore available catering options and packages
3. **Place Orders** - Select items, specify quantities, and add to cart
4. **Track Orders** - Monitor order status and delivery updates

### For Administrators
1. **Admin Dashboard** - Access comprehensive management interface
2. **Manage Menu** - Add new dishes, update pricing, and manage categories
3. **Process Orders** - Review incoming orders and update statuses

## 🗂️ Project Structure

Catering-Reservation-and-Ordering-System/\
├── client/\
│ ├── public/\
│ ├── src/\
│ │ ├── components/ # Reusable React components\
│ │ ├── pages/ # Page components\
│ │ ├── context/ # Context providers for state management\
│ │ ├── utils/ # Utility functions and helpers\
│ │ ├── styles/ # CSS and styling files\
│ │ └── App.js # Main App component\
│ └── package.json\
├── server/\
│ ├── controllers/ # Route controllers\
│ ├── middleware/ # Custom middleware functions\
│ ├── models/ # MongoDB schemas\
│ ├── routes/ # Express routes\
│ ├── uploads/ # File upload directory\
│ ├── utils/ # Utility functions\
│ └── server.js # Main server file\
└── README.md



---

⭐ If you found this project helpful, please give it a star on GitHub!
