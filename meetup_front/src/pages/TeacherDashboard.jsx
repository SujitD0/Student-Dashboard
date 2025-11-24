import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { jwtDecode } from "jwt-decode";
import { Trash2, Calendar, Clock, Filter, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const [user, setUser] = useState(null);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newSlot, setNewSlot] = useState({
    date: '',
    hour: '9',
    minute: '00',
    period: 'AM',
    duration: 60,
    topic: '',
    meeting_link: ''
  });
  const [filter, setFilter] = useState('all'); // all, available, booked
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
      const slotsRes = await API.get('slots/');
      setSlots(slotsRes.data);
      const bookingsRes = await API.get('bookings/');
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const addSlot = async (slotData) => {
    try {
      // Convert 12-hour format to 24-hour format
      let hour24 = parseInt(slotData.hour);
      if (slotData.period === 'PM' && hour24 !== 12) {
        hour24 += 12;
      } else if (slotData.period === 'AM' && hour24 === 12) {
        hour24 = 0;
      }
      const timeString = `${hour24.toString().padStart(2, '0')}:${slotData.minute}:00`;

      // Create datetime string and convert to ISO
      const start = `${slotData.date}T${timeString}`;
      const startDate = new Date(start);
      const endDate = new Date(startDate.getTime() + slotData.duration * 60000);

      await API.post('slots/', {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        duration_minutes: slotData.duration,
        topic: slotData.topic,
        meeting_link: slotData.meeting_link
      });
      fetchData();
    } catch (error) {
      console.error("Adding slot failed", error);
      throw error;
    }
  };

  const deleteSlot = async (slotId, isBooked) => {
    const confirmMessage = isBooked
      ? 'This slot is booked. Deleting it will also cancel the booking. Are you sure?'
      : 'Are you sure you want to delete this slot?';

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await API.delete(`slots/${slotId}/`);
      alert('Slot deleted successfully' + (isBooked ? ' and booking cancelled' : ''));
      fetchData();
    } catch (error) {
      console.error("Delete slot failed", error);
      alert('Failed to delete slot');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      // Client-side validation for past time
      const now = new Date();
      const selectedDate = new Date(newSlot.date);
      const isToday = selectedDate.toDateString() === now.toDateString();

      if (isToday) {
        let hour24 = parseInt(newSlot.hour);
        if (newSlot.period === 'PM' && hour24 !== 12) {
          hour24 += 12;
        } else if (newSlot.period === 'AM' && hour24 === 12) {
          hour24 = 0;
        }

        const slotTime = new Date(selectedDate);
        slotTime.setHours(hour24, parseInt(newSlot.minute), 0, 0);

        if (slotTime < now) {
          alert("Cannot create slots in the past. Please select a future time.");
          return;
        }
      }

      await addSlot(newSlot);
      setNewSlot({ ...newSlot, hour: '9', minute: '00', period: 'AM', topic: '', meeting_link: '' });
      alert('Schedule Updated');
    } catch (e) {
      console.error('Error adding slot:', e);
      alert('Failed to add slot: ' + (e.response?.data?.detail || e.message || 'Unknown error'));
    }
  };

  const filteredSlots = slots.filter(slot => {
    if (filter === 'available') return slot.is_available;
    if (filter === 'booked') return !slot.is_available;
    return true;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-black mb-8 border-b-4 border-black inline-block">TEACHER DASHBOARD</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section: Update Schedule  */}
        <div className="card h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center"><Clock className="mr-2" /> Add Availability</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-bold">Date</label>
              <input
                type="date"
                required
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
                max={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                onChange={e => setNewSlot({ ...newSlot, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold">Time</label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  required
                  className="input-field"
                  value={newSlot.hour}
                  onChange={e => setNewSlot({ ...newSlot, hour: e.target.value })}>
                  {[...Array(12)].map((_, i) => {
                    const hour = i + 1;
                    return <option key={hour} value={hour}>{hour}</option>;
                  })}
                </select>
                <select
                  required
                  className="input-field"
                  value={newSlot.minute}
                  onChange={e => setNewSlot({ ...newSlot, minute: e.target.value })}>
                  <option value="00">00</option>
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                </select>
                <select
                  required
                  className="input-field"
                  value={newSlot.period}
                  onChange={e => setNewSlot({ ...newSlot, period: e.target.value })}>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold">Duration (min)</label>
              <select className="input-field" value={newSlot.duration} onChange={e => setNewSlot({ ...newSlot, duration: Number(e.target.value) })}>
                <option value="30">30 Minutes</option>
                <option value="60">60 Minutes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold">Topic (Optional)</label>
              <input type="text" className="input-field" placeholder="e.g. Algebra, Physics"
                value={newSlot.topic}
                onChange={e => setNewSlot({ ...newSlot, topic: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-bold">Meeting Link (Optional)</label>
              <input type="url" className="input-field" placeholder="e.g. https://meet.google.com/..."
                value={newSlot.meeting_link}
                onChange={e => setNewSlot({ ...newSlot, meeting_link: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary w-full">Create Slot</button>
          </form>
        </div>

        {/* Section: View Schedule */}
        <div className="lg:col-span-2 space-y-8">

          {/* Upcoming Bookings */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center"><BookOpen className="mr-2" /> Upcoming Bookings</h2>
            {bookings.filter(b => b.status === 'confirmed').length === 0 ? (
              <p className="text-gray-500 italic">No upcoming bookings.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.filter(b => b.status === 'confirmed').map(booking => (
                  <div key={booking.id} className="card bg-white text-black border-2 border-black">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-lg">{booking.student.first_name} {booking.student.last_name}</div>
                        <div className="text-sm text-gray-600">{booking.student.email}</div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-bold rounded ${booking.status === 'confirmed' ? 'bg-yellow-500 text-black' :
                        booking.status === 'cancelled' ? 'bg-red-500 text-white' :
                          'bg-gray-500 text-white'
                        }`}>{booking.status.toUpperCase()}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-sm"><span className="text-gray-600">Time:</span> {new Date(booking.slot.start).toLocaleDateString()} @ {new Date(booking.slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                      <div className="text-sm mt-1"><span className="text-gray-600">Purpose:</span> {booking.purpose}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Schedule */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center"><Calendar className="mr-2" /> My Schedule</h2>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <select className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={filter} onChange={e => setFilter(e.target.value)}>
                  <option value="all">All Slots</option>
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                </select>
              </div>
            </div>

            {filteredSlots.length === 0 && <p className="text-gray-500 italic">No slots found.</p>}

            <div className="space-y-4">
              {filteredSlots.map(slot => (
                <div key={slot.id} className={`card flex justify-between items-start ${!slot.is_available ? 'bg-gray-50' : 'bg-white'}`}>
                  <div>
                    <div className="font-bold text-lg">
                      {new Date(slot.start).toLocaleDateString()} @ {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </div>
                    <div className="text-sm text-gray-600">
                      {slot.duration_minutes} minutes {slot.topic && <span className="font-semibold text-indigo-600">• {slot.topic}</span>}
                    </div>

                    {!slot.is_available ? (
                      <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Booked
                      </div>
                    ) : (
                      <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </div>
                    )}
                    {slot.meeting_link && (
                      <div className="mt-2 text-xs">
                        <a href={slot.meeting_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                          🔗 Meeting Link
                        </a>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => deleteSlot(slot.id, !slot.is_available)}
                    className="text-red-600 hover:text-red-800 p-2"
                    title="Delete Slot">
                    <Trash2 />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;