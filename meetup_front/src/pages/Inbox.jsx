import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { Mail, MailOpen, Bell, Clock, BookOpen } from 'lucide-react';
import Toast from '../components/Toast';

const Inbox = () => {
    const [notifications, setNotifications] = useState([]);
    const [_user, setUser] = useState(null);
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({ id: decoded.user_id, username: decoded.username, role: decoded.role });
                fetchNotifications();
            } catch {
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await API.get('notifications/');
            setNotifications(res.data);
        } catch (error) {
            console.error('Error fetching notifications', error);
            setToast({ message: 'Failed to load notifications', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await API.post(`notifications/${id}/mark_read/`);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
        } catch (error) {
            console.error('Error marking notification as read', error);
            setToast({ message: 'Failed to update notification', type: 'error' });
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-black border-b-4 border-black inline-block">
                        INBOX
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Messages and notifications from your teachers.
                    </p>
                </div>
                {unreadCount > 0 && (
                    <div className="flex items-center gap-2 bg-black text-white px-4 py-2 font-bold">
                        <Bell className="w-5 h-5" />
                        {unreadCount} unread
                    </div>
                )}
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="card animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-gray-300">
                    <Mail className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h2 className="text-xl font-bold text-gray-400 mb-2">No messages yet</h2>
                    <p className="text-gray-400">
                        When your teachers send notifications about your bookings, they'll appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`card relative transition-all duration-200 ${notification.is_read
                                ? 'bg-gray-50 border-gray-300'
                                : 'bg-white border-black border-2 shadow-hard'
                                }`}
                        >
                            {/* Unread indicator */}
                            {!notification.is_read && (
                                <div className="absolute top-4 right-4 w-3 h-3 bg-black rounded-full animate-pulse" />
                            )}

                            <div className="flex items-start gap-4">
                                <div className={`p-2 mt-1 ${notification.is_read ? 'bg-gray-200 text-gray-500' : 'bg-black text-white'}`}>
                                    {notification.is_read ? <MailOpen className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-lg">{notification.teacher_name}</span>
                                        <span className={`text-xs px-2 py-0.5 font-semibold ${notification.is_read
                                            ? 'bg-gray-200 text-gray-600'
                                            : 'bg-black text-white'
                                            }`}>
                                            {notification.is_read ? 'READ' : 'NEW'}
                                        </span>
                                    </div>

                                    {notification.booking_info && (
                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {notification.booking_info.date} @ {notification.booking_info.time}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <BookOpen className="w-3 h-3" />
                                                {notification.booking_info.topic}
                                            </span>
                                        </div>
                                    )}

                                    <div className={`p-4 border-2 ${notification.is_read ? 'border-gray-200 bg-white' : 'border-gray-300 bg-gray-50'}`}>
                                        <p className="text-gray-800 whitespace-pre-wrap">{notification.message}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-xs text-gray-400">
                                            {new Date(notification.created_at).toLocaleString()}
                                        </span>
                                        {!notification.is_read && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="text-sm font-bold px-3 py-1 border-2 border-black hover:bg-black hover:text-white transition-all duration-200"
                                            >
                                                Mark as Read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default Inbox;
