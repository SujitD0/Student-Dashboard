# 📚 Student-Teacher Meeting Scheduler

A modern, full-stack web application that streamlines the process of scheduling meetings between students and teachers. Built with Django REST Framework and React, this platform offers an intuitive interface for managing availability, booking sessions, and facilitating seamless communication.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.13.0-blue.svg)
![Django](https://img.shields.io/badge/django-5.2.6-green.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

---

## ✨ Features

### 👨‍🏫 For Teachers

- **Time Slot Management**: Create, edit, and delete available time slots with custom durations
- **Availability Control**: Mark slots as available or unavailable with one click
- **Meeting Configuration**: Set meeting topics, durations, and links for each time slot
- **Booking Overview**: View all student bookings in an organized dashboard
- **Cancellation Control**: Cancel bookings when necessary with automatic slot release

### 👨‍🎓 For Students

- **Browse Availability**: View all available teacher time slots in real-time
- **Easy Booking**: Book sessions with teachers by selecting from available slots
- **Meeting Details**: Add purpose, attachments, and choose meeting mode (online/offline)
- **Booking History**: Track all past and upcoming meetings
- **Flexible Cancellation**: Cancel bookings with automatic availability restoration

### 🔐 Authentication & Security

- **JWT-based Authentication**: Secure token-based authentication system
- **Role-based Access Control**: Separate permissions for students and teachers
- **Custom User Model**: Extended Django user model with role differentiation
- **Protected Routes**: Frontend and backend route protection

### 🎨 User Experience

- **Modern UI**: Clean, responsive design built with React and Tailwind CSS
- **Smooth Animations**: Enhanced user interactions with Framer Motion
- **Toast Notifications**: Real-time feedback for user actions
- **Dark Mode Ready**: Aesthetic design with professional styling
- **Mobile Responsive**: Seamless experience across all devices

---

## 🏗️ Tech Stack

### Backend
- **Framework**: Django 5.2.6
- **API**: Django REST Framework 3.16.1
- **Authentication**: Simple JWT 5.5.1
- **Database**: PostgreSQL (Production) / SQLite (Development)
- **Server**: Gunicorn 23.0.0
- **Static Files**: WhiteNoise 6.9.0

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 7.1.7
- **Styling**: Tailwind CSS 3.4.18
- **Routing**: React Router Dom 6.14.1
- **HTTP Client**: Axios 1.13.1
- **Animations**: Framer Motion 12.23.24
- **UI Components**: Headless UI, Heroicons, Lucide React
- **Date Handling**: Day.js 1.11.19

### Deployment
- **Platform**: Render.com
- **Database**: PostgreSQL
- **Environment**: Production-ready configuration

---

## 🚀 Getting Started

### Prerequisites

- Python 3.13.0 or higher
- Node.js 16+ and npm
- Git

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Student-Dashboard.git
cd Student-Dashboard
```

#### 2. Backend Setup

```bash
# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate  # On Windows
# source .venv/bin/activate  # On macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create environment file
copy .env.example .env  # On Windows
# cp .env.example .env  # On macOS/Linux

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

The backend API will be available at `http://localhost:8000/`

#### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd meetup_front

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173/`

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (for production)
DATABASE_URL=postgresql://user:password@host:port/dbname
```

### Database Configuration

The application automatically switches between SQLite (development) and PostgreSQL (production) based on the `DATABASE_URL` environment variable.

---

## 📡 API Endpoints

### Authentication
- `POST /api/register/` - Register new user (student or teacher)
- `POST /api/token/` - Obtain JWT token pair
- `POST /api/token/refresh/` - Refresh access token

### Time Slots
- `GET /api/timeslots/` - List all time slots (with filters)
- `POST /api/timeslots/` - Create time slot (teachers only)
- `GET /api/timeslots/{id}/` - Retrieve time slot details
- `PUT /api/timeslots/{id}/` - Update time slot (teachers only)
- `DELETE /api/timeslots/{id}/` - Delete time slot (teachers only)
- `POST /api/timeslots/{id}/mark_unavailable/` - Mark slot as unavailable

### Bookings
- `GET /api/bookings/` - List user's bookings (filtered by role)
- `POST /api/bookings/` - Create booking (students only)
- `GET /api/bookings/{id}/` - Retrieve booking details
- `POST /api/bookings/{id}/cancel/` - Cancel booking

---

## 📊 Database Schema

### Models

**User**
- Extends Django's `AbstractUser`
- Fields: `username`, `email`, `password`, `role` (student/teacher)

**TimeSlot**
- Fields: `teacher`, `start`, `end`, `duration_minutes`, `topic`, `meeting_link`, `is_available`, `created_at`
- Relationships: Belongs to a teacher (User)

**Booking**
- Fields: `student`, `slot`, `purpose`, `attachments`, `meeting_mode`, `meeting_link`, `status`, `created_at`
- Relationships: Belongs to a student (User) and a time slot (TimeSlot)

---

## 🎯 Core Functionality

### Booking Flow

1. **Teacher creates time slots** with specific dates, times, and meeting details
2. **Student browses available slots** filtered by availability and teacher
3. **Student books a slot** by providing purpose and meeting preferences
4. **System automatically marks slot as unavailable** to prevent double-booking
5. **Both parties receive booking confirmation** with meeting details
6. **Cancellation releases the slot** back to available status

### Permission System

- **IsTeacher**: Only teachers can create, update, and delete time slots
- **IsStudent**: Only students can create bookings
- **IsAuthenticated**: All authenticated users can view data based on their role

---

## 🧪 Development

### Project Structure

```
Student-Dashboard/
├── core/                 # Django app with models, views, serializers
│   ├── models.py        # User, TimeSlot, Booking models
│   ├── views.py         # API viewsets
│   ├── serializers.py   # DRF serializers
│   ├── permissions.py   # Custom permissions
│   └── urls.py          # App URL routing
├── meetup_back/         # Django project settings
│   ├── settings.py      # Configuration
│   └── urls.py          # Main URL routing
├── meetup_front/        # React frontend
│   └── src/
│       ├── components/  # Reusable components
│       ├── pages/       # Page components
│       ├── api/         # API integration
│       └── assets/      # Static assets
├── requirements.txt     # Python dependencies
├── build.sh            # Production build script
├── Procfile            # Deployment configuration
└── README.md           # This file
```

### Running Tests

```bash
# Backend tests
python manage.py test

# Frontend tests (if configured)
cd meetup_front
npm run test
```

### Database Reset

```bash
# Delete database and migrations
python manage.py flush

# Or for complete reset
rm db.sqlite3
python manage.py migrate
```

---

## 🚢 Deployment

### Deploy to Render.com

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure build settings**:
   - Build Command: `./build.sh`
   - Start Command: `gunicorn meetup_back.wsgi:application`
4. **Set environment variables**:
   - `SECRET_KEY`
   - `DATABASE_URL` (automatically provided by Render PostgreSQL)
   - `ALLOWED_HOSTS`
   - `DEBUG=False`
5. **Create PostgreSQL database** and link to your service
6. **Deploy!**

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Authors

- **Your Name** - *Initial work*

---

## 🙏 Acknowledgments

- Django REST Framework for the powerful API toolkit
- React team for the amazing frontend library
- Tailwind CSS for the utility-first CSS framework
- All contributors who help improve this project

---

## 📞 Support

For support, email your-email@example.com or open an issue in the GitHub repository.

---

## 🗺️ Roadmap

- [ ] Email notifications for bookings and cancellations
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Video call integration (Zoom, Google Meet)
- [ ] Rating and review system
- [ ] Advanced filtering and search
- [ ] Multi-language support
- [ ] Mobile applications (iOS/Android)
- [ ] Analytics dashboard for teachers

---

<div align="center">
  <p>Made with ❤️ by the Student-Teacher Meeting Scheduler Team</p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>
