import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usersAPI, API_BASE_URL } from '../../services/api';
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
    FaBan,
    FaUnlock,
    FaUserShield,
    FaUserCircle,
    FaTimes,
    FaEnvelope,
    FaBars,
    FaHome
} from 'react-icons/fa';

const AdminUsers = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const getAvatarUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${API_BASE_URL}${url}`;
    };

    // Modal State
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({
        username: '',
        email: '',
        role: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await usersAPI.getAll();
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBlock = async (userToUpdate) => {
        const isBlocked = userToUpdate.status === 'blocked' || userToUpdate.status === 1;
        const newStatus = isBlocked ? 'active' : 'blocked';
        const confirmMsg = `Are you sure you want to ${isBlocked ? 'unblock' : 'block'} this user?`;

        if (!window.confirm(confirmMsg)) return;

        try {
            await usersAPI.update(userToUpdate.id, { status: newStatus });
            toast.success(`User ${isBlocked ? 'unblocked' : 'blocked'} successfully`);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user status:', error);
            toast.error('Failed to update user status');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            await usersAPI.delete(id);
            toast.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user');
        }
    };

    const openEditModal = (u) => {
        setEditingUser(u);
        setEditFormData({
            username: u.username,
            email: u.email,
            role: u.role === 'admin' || u.role === 1 ? 'admin' : 'user'
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await usersAPI.update(editingUser.id, editFormData);
            toast.success('User updated successfully');
            setShowEditModal(false);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Failed to update user');
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch =
            u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === 'all' ||
            (roleFilter === 'admin' ? (u.role === 'admin' || u.role === 1) : (u.role !== 'admin' && u.role !== 1));

        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role) => {
        if (role === 'admin' || role === 1) {
            return (
                <span className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 border border-purple-200 rounded-full text-xs font-bold">
                    <FaUserShield size={10} /> Admin
                </span>
            );
        }
        return (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 border border-blue-200 rounded-full text-xs font-bold">
                User
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
                                placeholder="Search users by name, email or status..."
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
                            {['all', 'admin', 'user'].map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setRoleFilter(role)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${roleFilter === role
                                        ? 'bg-slate-800 text-white shadow-lg shadow-slate-200'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">User Profile</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-3xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                                                        <img
                                                            src={getAvatarUrl(u.avatar_url) || `https://ui-avatars.com/api/?name=${u.username}&background=random`}
                                                            alt={u.username}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800">{u.username}</p>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">ID: #{u.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-slate-600 text-sm">{u.email}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getRoleBadge(u.role)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${(u.status === 'blocked' || u.status === 1)
                                                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                    }`}>
                                                    {(u.status === 'blocked' || u.status === 1) ? 'Blocked' : 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(u)}
                                                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                                        title="Edit User"
                                                    >
                                                        <FaEdit size={14} />
                                                    </button>

                                                    {u.id !== user?.id && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleToggleBlock(u)}
                                                                className={`p-2 rounded-lg transition-colors ${(u.status === 'blocked' || u.status === 1)
                                                                    ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                                                                    : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                                                                    }`}
                                                                title={(u.status === 'blocked' || u.status === 1) ? "Unblock User" : "Block User"}
                                                            >
                                                                {(u.status === 'blocked' || u.status === 1) ? <FaUnlock size={14} /> : <FaBan size={14} />}
                                                            </button>

                                                            <button
                                                                onClick={() => handleDeleteUser(u.id)}
                                                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                                title="Delete User"
                                                            >
                                                                <FaTrash size={14} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-bold">
                                                No users found matching your search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* Edit User Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
                        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h2 className="text-xl font-black text-slate-800">Edit User Details</h2>
                            <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Username</label>
                                <input
                                    type="text"
                                    value={editFormData.username}
                                    onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-700"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    value={editFormData.email}
                                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-700"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">User Role</label>
                                <select
                                    value={editFormData.role}
                                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-700"
                                >
                                    <option value="user">Regular User</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-lg shadow-blue-500/30"
                                >
                                    Update User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
