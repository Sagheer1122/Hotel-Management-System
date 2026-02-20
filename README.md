# 🏨 Hotel Management System (HMS)

A modern, full-stack Hotel Management System built with **React**, **Tailwind CSS**, **Ruby on Rails API**, and **PostgreSQL**.

![HMS Preview](https://img.shields.io/badge/Status-Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2-blue)
![Rails](https://img.shields.io/badge/Rails-8.1-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)

## ✨ Features

### 🔐 Authentication & Authorization
- User registration with email and password
- JWT-based authentication
- Role-based access control (Admin/User)
- Account status management (Active, Blocked, Verified)

### 🏠 Room Management
- Full CRUD operations for rooms
- Room categories: Single, Couple, Family, Presidential
- Room status: Available, Booked, Unavailable
- Featured rooms highlighting
- Advanced filtering (price, capacity, category, availability)
- Image upload support with Active Storage

### 📅 Booking System
- Date-based booking with validation
- Booking statuses: Pending, Approved, Cancelled, Completed
- User booking history
- Admin booking management panel
- Automatic room status updates
- Overlap detection to prevent double bookings

### ⭐ Review System
- User reviews and ratings (1-5 stars)
- Edit/delete own reviews
- Average rating calculation per room
- Review display on room details

### 📊 Admin Dashboard
- Real-time statistics (Users, Rooms, Bookings)
- Room management panel
- Booking management with status updates
- User management panel
- Visual charts and graphs

### 🎨 UI/UX Design
- Modern, clean SaaS dashboard style
- Soft blue, white, and gray color palette
- Fully responsive design (desktop, tablet, mobile)
- Rounded cards with subtle shadows
- Glassmorphism effects
- Professional typography (Inter font)
- Smooth animations and transitions

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Toastify** - Toast notifications

### Backend
- **Ruby on Rails 8.1** - API framework
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **BCrypt** - Password hashing
- **Rack CORS** - Cross-origin resource sharing
- **Active Storage** - File uploads

## 📁 Project Structure

```
HMS/
├── hms-frontend/          # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   └── Navbar.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── RoomList.jsx
│   │   │   └── RoomDetails.jsx
│   │   ├── services/      # API service layer
│   │   │   └── api.js
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── hms-api/               # Rails API Backend
    ├── app/
    │   ├── controllers/
    │   │   └── api/v1/    # API controllers
    │   │       ├── auth_controller.rb
    │   │       ├── users_controller.rb
    │   │       ├── rooms_controller.rb
    │   │       ├── bookings_controller.rb
    │   │       └── reviews_controller.rb
    │   └── models/        # Data models
    │       ├── user.rb
    │       ├── room.rb
    │       ├── booking.rb
    │       └── review.rb
    ├── config/
    │   ├── routes.rb
    │   └── initializers/cors.rb
    └── db/
        └── migrate/       # Database migrations
```

## 🚀 Setup Instructions

### Prerequisites
- **Ruby** 3.x or higher
- **Rails** 8.x
- **Node.js** 18.x or higher
- **PostgreSQL** 14.x or higher
- **npm** or **yarn**

### 1️⃣ Backend Setup (Rails API)

```bash
# Navigate to backend directory
cd hms-api

# Install dependencies
bundle install

# Configure database
# Edit config/database.yml with your PostgreSQL credentials

# Create and setup database
rails db:create
rails db:migrate

# (Optional) Seed sample data
rails db:seed

# Start Rails server
rails server
```

The API will be available at `http://localhost:3000`

### 2️⃣ Frontend Setup (React)

```bash
# Navigate to frontend directory
cd hms-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### 3️⃣ Environment Variables

**Backend (.env)**
```env
DATABASE_URL=postgresql://username:password@localhost/hms_development
SECRET_KEY_BASE=your_secret_key_here
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:3000/api/v1
```

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication Endpoints

#### Register
```http
POST /users
Content-Type: application/json

{
  "user": {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Rooms Endpoints

```http
GET    /rooms              # List all rooms
GET    /rooms/:id          # Get room details
POST   /rooms              # Create room (Admin)
PUT    /rooms/:id          # Update room (Admin)
DELETE /rooms/:id          # Delete room (Admin)
GET    /rooms/featured     # Get featured rooms
```

### Bookings Endpoints

```http
GET    /bookings           # List all bookings
GET    /bookings/:id       # Get booking details
POST   /bookings           # Create booking
PUT    /bookings/:id       # Update booking
DELETE /bookings/:id       # Cancel booking
```

### Reviews Endpoints

```http
GET    /rooms/:room_id/reviews    # Get room reviews
POST   /rooms/:room_id/reviews    # Create review
PUT    /reviews/:id               # Update review
DELETE /reviews/:id               # Delete review
```

## 🎯 Key Features Implementation

### Room Filtering
```javascript
// Frontend example
const filteredRooms = rooms.filter(room => {
  if (category && room.category !== category) return false;
  if (minPrice && room.price < minPrice) return false;
  if (maxPrice && room.price > maxPrice) return false;
  return true;
});
```

### Booking Validation
```ruby
# Backend validation
def room_availability
  overlapping_bookings = Booking.where(room_id: room.id)
    .where.not(status: :cancelled)
    .where('start_date < ? AND end_date > ?', end_date, start_date)
  
  if overlapping_bookings.exists?
    errors.add(:base, "Room is not available for the selected dates")
  end
end
```

## 🎨 Design System

### Colors
- **Primary Blue**: `#1a73e8`
- **Secondary**: `#5f6368`
- **Accent Orange**: `#ff6d00`
- **Success Green**: `#10b981`
- **Warning Yellow**: `#f59e0b`

### Typography
- **Font Family**: Inter, system fonts
- **Headings**: Bold, 700 weight
- **Body**: Regular, 400 weight

## 📸 Screenshots

### Home Page
Modern hero section with search functionality and room listings.

### Dashboard
Comprehensive admin dashboard with statistics and management panels.

### Room Details
Detailed room information with booking form and reviews.

## 🔒 Security Features

- Password hashing with BCrypt
- JWT token authentication
- CORS configuration
- SQL injection prevention (Active Record)
- XSS protection
- CSRF token verification

## 🚧 Future Enhancements

- [ ] Email verification system
- [ ] Password reset functionality
- [ ] Payment gateway integration
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Mobile app (React Native)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

Built with ❤️ for modern hotel management.

---

**Need Help?** Check the [Issues](https://github.com/yourusername/hms/issues) page or create a new issue.
