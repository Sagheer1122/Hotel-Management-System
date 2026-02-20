import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import RoomList from './pages/RoomList';
import RoomDetails from './pages/RoomDetails';
import Bookings from './pages/Bookings';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRooms from './pages/admin/AdminRooms';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBookings from './pages/admin/AdminBookings';
import AdminPayments from './pages/admin/AdminPayments';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminReviews from './pages/admin/AdminReviews';
import AdminProfile from './pages/admin/AdminProfile';
import About from './pages/About';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const location = useLocation();
    const hideNavbar = ['/login', '/register', '/dashboard', '/forgot-password', '/reset-password'].includes(location.pathname) ||
        location.pathname.startsWith('/admin/');

    return (
        <AuthProvider>
            <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
                {!hideNavbar && <Navbar />}
                <main className={hideNavbar ? 'flex-1' : 'flex-1'}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/rooms" element={<RoomList />} />
                        <Route path="/rooms/:id" element={<RoomDetails />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/bookings" element={<Bookings />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/rooms" element={<AdminRooms />} />
                        <Route path="/admin/users" element={<AdminUsers />} />
                        <Route path="/admin/bookings" element={<AdminBookings />} />
                        <Route path="/admin/payments" element={<AdminPayments />} />
                        <Route path="/admin/inquiries" element={<AdminInquiries />} />
                        <Route path="/admin/reviews" element={<AdminReviews />} />
                        <Route path="/admin/profile" element={<AdminProfile />} />
                    </Routes>
                </main>
                {!hideNavbar && <Footer />}
                <ToastContainer position="bottom-right" autoClose={3000} />
            </div>
        </AuthProvider>
    );
}

export default App;
