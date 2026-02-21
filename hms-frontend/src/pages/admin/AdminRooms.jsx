import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { roomsAPI } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from '../../components/admin/Sidebar';
import {
    FaHotel,
    FaUsers,
    FaBed,
    FaCalendarAlt,
    FaSignOutAlt,
    FaSearch,
    FaBell,
    FaEdit,
    FaTrash,
    FaPlus,
    FaUserCircle,
    FaImages,
    FaEnvelope,
    FaBars,
    FaHome
} from 'react-icons/fa';

const AdminRooms = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const API_BASE_URL = 'https://hotel-management-system-uqxt.onrender.com';

    const getAvatarUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${API_BASE_URL}${url}`;
    };

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        capacity: '',
        category: 'single_room',
        status: 'available',
        is_featured: false,
        image: '' // Added image field if API supports it, or placeholder
    });

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await roomsAPI.getAll();
            setRooms(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            toast.error('Failed to load rooms');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRoom = async (id) => {
        if (!window.confirm('Are you sure you want to delete this room?')) return;
        try {
            await roomsAPI.delete(id);
            toast.success('Room deleted successfully');
            fetchRooms();
        } catch (error) {
            console.error('Error deleting room:', error);
            toast.error('Failed to delete room');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRoom) {
                await roomsAPI.update(editingRoom.id, formData);
                toast.success('Room updated successfully');
            } else {
                await roomsAPI.create(formData);
                toast.success('Room created successfully');
            }
            setShowModal(false);
            fetchRooms();
            resetForm();
        } catch (error) {
            console.error('Error saving room:', error);
            toast.error('Failed to save room');
        }
    };

    const openEditModal = (room) => {
        setEditingRoom(room);
        setFormData({
            name: room.name,
            description: room.description || '',
            price: room.price,
            capacity: room.capacity,
            category: room.category,
            status: room.status,
            is_featured: room.is_featured,
            image: room.image || ''
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            capacity: '',
            category: 'single_room',
            status: 'available',
            is_featured: false,
            image: ''
        });
        setEditingRoom(null);
    };

    const filteredRooms = rooms
        .filter(room => {
            const matchesSearch =
                room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                room.description?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter = statusFilter === 'all' || room.status === statusFilter;

            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            if (a.status === 'booked' && b.status !== 'booked') return -1;
            if (a.status !== 'booked' && b.status === 'booked') return 1;
            return 0;
        });

    const getStatusBadge = (status) => {
        const styles = {
            available: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
            booked: 'bg-blue-100 text-blue-700 border border-blue-200',
            maintenance: 'bg-amber-100 text-amber-700 border border-amber-200',
            unavailable: 'bg-rose-100 text-rose-700 border border-rose-200'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${styles[status] || styles.unavailable}`}>
                {status}
            </span>
        );
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-slate-900">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content */}
            <div className="flex-1 lg:ml-80 flex flex-col min-w-0">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
                    <div className="px-4 md:px-8 py-4 flex items-center justify-between gap-4">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FaBars size={24} />
                        </button>

                        <div className="flex items-center gap-4">
                            <Link to="/" className="text-gray-500 hover:text-blue-600 font-bold text-sm flex items-center gap-2">
                                <FaHome size={16} /> Home
                            </Link>
                        </div>

                        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search rooms by name or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-slate-600 text-sm"
                            />
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-4 relative">

                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                        className="flex items-center gap-3 hover:bg-slate-50 rounded-full p-1 pr-3 transition-colors border border-transparent hover:border-slate-100"
                                    >
                                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-blue-50 bg-white">
                                            <img
                                                src={getAvatarUrl(user?.avatar_url) || `https://ui-avatars.com/api/?name=${user?.username || 'Admin'}&background=3b82f6&color=fff`}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="text-left hidden sm:block">
                                            <p className="text-sm font-bold text-slate-800 leading-tight">{user?.username || 'Admin'}</p>
                                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Administrator</p>
                                        </div>
                                    </button>

                                    {showProfileMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
                                            <div className="px-4 py-2 border-b border-slate-50 mb-2">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account</p>
                                            </div>
                                            <Link
                                                to="/admin/profile"
                                                className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 font-bold transition-all"
                                                onClick={() => setShowProfileMenu(false)}
                                            >
                                                <FaUserCircle size={16} />
                                                <span>My Profile</span>
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    navigate('/');
                                                    toast.success('Logged out successfully');
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 font-bold transition-all text-left"
                                            >
                                                <FaSignOutAlt size={16} />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-8 no-scrollbar">
                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row justify-end gap-4 mb-8">
                        <div className="flex gap-2">
                            {['all', 'available', 'booked', 'maintenance'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${statusFilter === status
                                        ? 'bg-slate-800 text-white shadow-lg shadow-slate-200'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                            <button
                                onClick={() => {
                                    resetForm();
                                    setShowModal(true);
                                }}
                                className="ml-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2"
                            >
                                <FaPlus size={14} />
                                <span>Add Room</span>
                            </button>
                        </div>
                    </div>

                    {/* Rooms Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Room Details</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Price/Night</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Capacity</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredRooms.map((room) => (
                                        <tr key={room.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                                                        <img
                                                            src={room.image || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=400&q=80'}
                                                            alt={room.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold text-slate-800">{room.name}</p>
                                                            {room.is_featured && <span className="text-xs text-amber-500 font-black tracking-tighter">FEATURED</span>}
                                                        </div>
                                                        <p className="text-xs font-bold text-slate-400 mt-1 line-clamp-1 w-40">{room.description || 'No description'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-slate-600 capitalize">{room.category.replace('_', ' ')}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-black text-slate-800">Rs.{room.price}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-slate-500 font-bold text-sm">
                                                    <FaUsers size={14} className="text-slate-400" />
                                                    <span>{room.capacity}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(room.status)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(room)}
                                                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                                        title="Edit Room"
                                                    >
                                                        <FaEdit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteRoom(room.id)}
                                                        className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors"
                                                        title="Delete Room"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredRooms.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-bold">
                                                No rooms found matching your search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* Edit/Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-fadeIn">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center flex-shrink-0">
                            <h2 className="text-xl font-black text-slate-800">
                                {editingRoom ? 'Edit Room' : 'Add New Room'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
                        </div>

                        {/* Scrollable Form Content */}
                        <div className="overflow-y-auto p-8">
                            <form id="room-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Room Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-700"
                                            placeholder="e.g. Deluxe Ocean View"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-700"
                                        >
                                            <option value="single_room">Single Room</option>
                                            <option value="couple_room">Couple Room</option>
                                            <option value="family_room">Family Room</option>
                                            <option value="presidential_room">Presidential Suite</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-700"
                                        rows="3"
                                        placeholder="Describe the room features..."
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Room Image URL</label>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <input
                                            type="url"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-700 text-sm"
                                            placeholder="https://images.unsplash.com/photo-..."
                                        />
                                        {formData.image && (
                                            <div className="w-full sm:w-20 h-20 sm:h-12 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                                                <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium italic">Paste a direct image link. If left empty, a category-default image will be used.</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price (Rs.)</label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-700"
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Capacity</label>
                                        <input
                                            type="number"
                                            value={formData.capacity}
                                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-700"
                                            min="1"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-700"
                                        >
                                            <option value="available">Available</option>
                                            <option value="booked">Booked</option>
                                            <option value="maintenance">Maintenance</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        checked={formData.is_featured}
                                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="featured" className="text-sm font-bold text-slate-700 cursor-pointer">
                                        Mark as Featured Room
                                    </label>
                                </div>
                            </form>
                        </div>

                        {/* Modal Footer - Fixed at bottom */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-4 flex-shrink-0">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                className="flex-1 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="room-form"
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-lg shadow-blue-500/30"
                            >
                                {editingRoom ? 'Update Room' : 'Create Room'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRooms;
