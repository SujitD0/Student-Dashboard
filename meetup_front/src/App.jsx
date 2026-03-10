import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { Calendar, Users, Clock, ArrowRight, BookOpen, Shield, Zap } from "lucide-react";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Resources from "./pages/Resources";
import Inbox from "./pages/Inbox";
import ProtectedRoute from "./components/ProtectedRoute";

/* ───────────────────── Carousel Component ───────────────────── */
const carouselSlides = [
  {
    title: "Smart Scheduling",
    description: "Book appointments with teachers in just a few clicks. Our intelligent system makes finding the right time effortless.",
    icon: <Calendar className="w-10 h-10" />,
  },
  {
    title: "Real-time Notifications",
    description: "Stay updated with instant notifications about your bookings, class preparations, and teacher messages.",
    icon: <Zap className="w-10 h-10" />,
  },
  {
    title: "Resource Library",
    description: "Access a curated collection of study materials, academic tools, and productivity resources.",
    icon: <BookOpen className="w-10 h-10" />,
  },
  {
    title: "Secure Platform",
    description: "Your data is protected with industry-standard security. Focus on learning while we handle the rest.",
    icon: <Shield className="w-10 h-10" />,
  },
];

function Carousel() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselSlides.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="relative overflow-hidden border-4 border-black bg-white">
      {/* Progress bar */}
      <div className="flex">
        {carouselSlides.map((_, idx) => (
          <div
            key={idx}
            className="h-1 flex-1 cursor-pointer transition-all duration-300"
            style={{ backgroundColor: idx === current ? '#000' : '#e5e5e5' }}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>

      <div className="p-8 md:p-12 min-h-[250px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col md:flex-row items-center gap-8 w-full"
          >
            <div className="p-4 bg-black text-white flex-shrink-0">
              {carouselSlides[current].icon}
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black mb-3">
                {carouselSlides[current].title}
              </h3>
              <p className="text-gray-600 text-lg">
                {carouselSlides[current].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-2 pb-6">
        {carouselSlides.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 border-2 border-black transition-all duration-200 ${idx === current ? 'bg-black' : 'bg-white hover:bg-gray-300'
              }`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
}

/* ───────────────────── Moving Marquee ───────────────────── */
function Marquee() {
  const items = [
    "📚 Book Appointments", "⏰ Smart Scheduling", "💬 Real-time Chat",
    "🎓 Expert Teachers", "📊 Track Progress", "🔔 Instant Notifications",
    "📖 Resource Library", "🛡️ Secure Platform",
  ];

  return (
    <div className="bg-black text-white overflow-hidden py-3 border-y-4 border-black">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, idx) => (
          <span key={idx} className="mx-8 font-bold text-sm tracking-wider">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────── Home Component ───────────────────── */
function Home() {
  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Easy Scheduling",
      description: "Browse available time slots and book appointments that fit your schedule perfectly.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Connect Instantly",
      description: "Find the right teacher for your subject and connect for personalized guidance.",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Save Time",
      description: "No more back-and-forth emails. Get confirmation in seconds with our streamlined process.",
    },
  ];

  const steps = [
    { step: "01", title: "Create Account", description: "Sign up as a student or teacher in seconds." },
    { step: "02", title: "Find & Book", description: "Browse available slots and book your preferred time." },
    { step: "03", title: "Get Notified", description: "Receive confirmations and preparation notes via your inbox." },
    { step: "04", title: "Meet & Learn", description: "Join your session online or offline and excel in your studies." },
  ];

  const stats = [
    { number: "500+", label: "Active Students" },
    { number: "50+", label: "Expert Teachers" },
    { number: "1,200+", label: "Sessions Booked" },
    { number: "98%", label: "Satisfaction Rate" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-3xl py-20 sm:py-32 lg:py-36">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-1 mb-6 border-2 border-black text-sm font-bold bg-white">
              ✨ THE SMART WAY TO CONNECT
            </div>
            <h1 className="text-5xl font-black tracking-tight text-gray-900 sm:text-7xl leading-tight">
              Connect with your{" "}
              <span className="bg-black text-white px-3 py-1 inline-block -rotate-1">
                Teachers
              </span>{" "}
              seamlessly
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-xl mx-auto">
              Book appointments, manage your schedule, and stay organized with the Student-Teacher Meet platform.
              Your academic journey, simplified.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-4">
              <Link
                to="/register"
                className="btn-primary text-base px-6 py-3 flex items-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="text-base font-bold leading-6 text-gray-900 border-2 border-black px-6 py-3 hover:-translate-y-1 hover:shadow-hard transition-all duration-200">
                Log in <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Marquee Band */}
      <Marquee />

      {/* Carousel Section */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-black mb-8 text-center">
            Platform Highlights
          </h2>
          <Carousel />
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-black text-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-black mb-2 text-center">Why Choose Us</h2>
            <p className="text-gray-400 text-center mb-12 max-w-lg mx-auto">
              Everything you need to streamline student-teacher communication in one platform.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.15 }}
                className="border-2 border-white p-8 hover:-translate-y-2 hover:bg-white hover:text-black transition-all duration-300 group cursor-default"
              >
                <div className="mb-4 p-3 border-2 border-white group-hover:border-black inline-block transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 group-hover:text-gray-600 transition-colors">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-black mb-2 text-center">How It Works</h2>
            <p className="text-gray-600 text-center mb-12 max-w-md mx-auto">
              Getting started is simple. Follow these four steps to begin your journey.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative card group"
              >
                <div className="text-5xl font-black text-gray-100 group-hover:text-gray-200 transition-colors absolute top-2 right-4 select-none">
                  {step.step}
                </div>
                <div className="relative z-10 pt-8">
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-y-4 border-black">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className={`py-10 px-6 text-center ${idx < stats.length - 1 ? 'border-r-2 border-black' : ''
                }`}
            >
              <div className="text-4xl md:text-5xl font-black">{stat.number}</div>
              <div className="text-sm text-gray-600 mt-1 font-semibold uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-black mb-4">
              Ready to get started?
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Join hundreds of students and teachers already using our platform to make education more accessible.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/register"
                className="btn-primary text-base px-8 py-3 flex items-center gap-2 group"
              >
                Create Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────── App ───────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <Resources />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inbox"
            element={
              <ProtectedRoute>
                <Inbox />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}