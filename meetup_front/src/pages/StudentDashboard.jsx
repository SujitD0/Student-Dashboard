import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { jwtDecode } from "jwt-decode";
import { Calendar, CheckCircle, Search, Paperclip, X, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); // Teachers
  const [slots, setSlots] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [bookingSlot, setBookingSlot] = useState(null);
  const [form, setForm] = useState({
    purpose: '',
    topics: '',
    attachment: null,
    meeting_mode: 'online'
  });
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ id: decoded.user_id, username: decoded.username, role: decoded.role });
        fetchData();
      } catch (e) {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, []);

  const fetchData = async () => {
    try {
      const slotsRes = await API.get('slots/?available=true');
      setSlots(slotsRes.data);

      const uniqueTeachers = [];
      const map = new Map();
      slotsRes.data.forEach(s => {
        if (s.teacher && typeof s.teacher === 'object' && !map.has(s.teacher.id)) {
          map.set(s.teacher.id, true);
          uniqueTeachers.push(s.teacher);
        }
      });
      setUsers(uniqueTeachers);

      const bookingsRes = await API.get('bookings/');
      setMyBookings(bookingsRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
      showToast('Failed to load data', 'error');
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const bookSlot = async (slotId, details) => {
    try {
      const formData = new FormData();
      formData.append('slot_id', slotId);
      formData.append('purpose', `${details.purpose}\n\nTopics: ${details.topics}`);
      formData.append('meeting_mode', details.meeting_mode);

      if (details.attachment) {
        formData.append('attachments', details.attachment);
      }

      await API.post('bookings/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchData();
    } catch (error) {
      console.error("Booking failed", error);
      throw error;
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await API.post(`bookings/${bookingId}/cancel/`);
      showToast('Booking cancelled successfully', 'success');
      fetchData();
    } catch (error) {
      console.error("Cancel failed", error);
      showToast('Failed to cancel booking', 'error');
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await bookSlot(bookingSlot.id, form);
      showToast('Booking confirmed! Teacher has been notified.', 'success');
      setBookingSlot(null);
      setForm({ purpose: '', topics: '', attachment: null, meeting_mode: 'online' });
    } catch (err) {
      showToast('Booking failed. Please try again.', 'error');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, attachment: file });
    }
  };

  // Filter slots based on selections
  const availableSlots = slots.filter(s => {
    const matchesTeacher = !selectedTeacher || s.teacher.id === Number(selectedTeacher);
    const matchesDate = !selectedDate || new Date(s.start).toLocaleDateString() === new Date(selectedDate).toLocaleDateString();
    const matchesSubject = !selectedSubject || (s.topic && s.topic.toLowerCase().includes(selectedSubject.toLowerCase()));
    return matchesTeacher && matchesDate && matchesSubject && s.is_available;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-black mb-8 border-b-4 border-black inline-block">STUDENT DASHBOARD</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: Browse Teachers & Slots */}
        <div className="lg:col-span-2 space-y-6">

          {/* Search Filters */}
          <div className="card">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <Filter className="mr-2" /> Filter Available Slots
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">Teacher</label>
                <select className="input-field" value={selectedTeacher} onChange={e => setSelectedTeacher(e.target.value)}>
                  <option value="">All Teachers</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.first_name} {u.last_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Subject/Topic</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Algebra"
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Available Slots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableSlots.map(slot => {
              return (
                <div key={slot.id} className="card flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xl">{slot.teacher.first_name} {slot.teacher.last_name}</h3>
                    <div className="text-sm text-gray-600 mt-1">{slot.teacher.email}</div>
                    {slot.topic && <div className="mt-2 inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded">{slot.topic}</div>}
                    <div className="text-lg border-t-2 border-gray-200 pt-2 mt-2">
                      {new Date(slot.start).toLocaleDateString()}
                      <span className="font-bold block">
                        {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} ({slot.duration_minutes} min)
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setBookingSlot(slot)}
                    className="btn-primary mt-4 w-full">
                    Book Slot
                  </button>
                </div>
              )
            })}
            {availableSlots.length === 0 && <p className="col-span-2 text-gray-500 italic">No available slots found. Try adjusting your filters.</p>}
          </div>
        </div>

        {/* Right: My Bookings */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center"><CheckCircle className="mr-2" /> My Scheduled Meets</h2>
          <div className="space-y-4">
            {myBookings.map(booking => {
              return (
                <div key={booking.id} className="card bg-white text-black border-2 border-black">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold">Booking #{booking.id}</div>
                    <span className={`px-2 py-1 text-xs font-bold rounded ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-800">
                    <strong>Teacher:</strong> {booking.slot.teacher.first_name} {booking.slot.teacher.last_name}
                  </div>
                  <div className="text-sm text-gray-800">
                    <strong>Time:</strong> {new Date(booking.slot.start).toLocaleDateString()} @ {new Date(booking.slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </div>
                  <div className="text-xs mt-2 bg-gray-100 p-2 rounded border border-gray-300">
                    <strong>Purpose:</strong> {booking.purpose}
                  </div>
                  {booking.meeting_mode === 'online' && booking.slot.meeting_link && (
                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                      <div className="text-xs font-semibold text-blue-900 mb-1">Meeting Link:</div>
                      <a href={booking.slot.meeting_link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline break-all">
                        {booking.slot.meeting_link}
                      </a>
                    </div>
                  )}
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to cancel this booking?')) {
                          cancelBooking(booking.id);
                        }
                      }}
                      className="mt-3 w-full px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white font-bold rounded border-2 border-black">
                      Cancel Booking
                    </button>
                  )}
                </div>
              )
            })}
            {myBookings.length === 0 && <p className="text-gray-500 italic">No bookings yet.</p>}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingSlot && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white p-8 max-w-md w-full border-4 border-black shadow-2xl">
            <h2 className="text-2xl font-black mb-4">Finalize Booking</h2>
            <div className="mb-4 p-3 bg-gray-100 rounded border border-gray-300">
              <div className="text-sm"><strong>Teacher:</strong> {bookingSlot.teacher.first_name} {bookingSlot.teacher.last_name}</div>
              <div className="text-sm"><strong>Time:</strong> {new Date(bookingSlot.start).toLocaleDateString()} @ {new Date(bookingSlot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
            </div>
            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="font-bold block">Purpose</label>
                <select className="input-field" required value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })}>
                  <option value="">Select...</option>
                  <option>Doubt Clarification</option>
                  <option>Project Guidance</option>
                  <option>Assessment</option>
                  <option>General Discussion</option>
                </select>
              </div>
              <div>
                <label className="font-bold block">Topics/Questions</label>
                <textarea
                  className="input-field h-24"
                  required
                  value={form.topics}
                  onChange={e => setForm({ ...form, topics: e.target.value })}
                  placeholder="What do you want to discuss?"
                />
              </div>
              <div>
                <label className="font-bold block">Meeting Mode</label>
                <select className="input-field" value={form.meeting_mode} onChange={e => setForm({ ...form, meeting_mode: e.target.value })}>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              <div>
                <label className="font-bold block">Attachments (Optional)</label>
                <div className="border-2 border-dashed border-black p-4 text-center hover:bg-gray-50">
                  <Paperclip className="mx-auto mb-2" />
                  <span className="text-sm block mb-2">
                    {form.attachment ? form.attachment.name : 'Upload Code/Docs'}
                  </span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => {
                  setBookingSlot(null);
                  setForm({ purpose: '', topics: '', attachment: null, meeting_mode: 'online' });
                }} className="btn-secondary w-1/2">Cancel</button>
                <button type="submit" className="btn-primary w-1/2">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
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

export default StudentDashboard;
