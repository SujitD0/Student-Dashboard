import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { jwtDecode } from "jwt-decode";

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    navigate('/login');
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: user ? (user.role === 'teacher' ? '/teacher' : '/student') : '/student', protected: true },
    { name: 'Resources', href: '/resources', protected: true },
    { name: 'Inbox', href: '/inbox', protected: true },
  ];

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    // For login/register pages, don't highlight any tab
    if (location.pathname === '/login' || location.pathname === '/register') return false;
    return location.pathname.startsWith(href);
  };

  const handleNavClick = (e, item) => {
    if (item.protected && !user) {
      e.preventDefault();
      navigate('/login');
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''
        }`}>
        <nav className="bg-black flex items-center justify-between px-6 lg:px-8 h-16" aria-label="Global">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-white flex items-center justify-center font-black text-black text-sm group-hover:bg-gray-200 transition-colors">
                ST
              </div>
              <span className="text-white font-bold text-lg hidden sm:block">
                Student–Teacher Meet
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Desktop nav links */}
          <div className="hidden lg:flex lg:gap-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`px-4 py-2 text-sm font-semibold transition-all duration-200 ${isActive(item.href)
                  ? 'bg-white text-black'
                  : 'text-white hover:bg-white/10'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop auth buttons */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">
            {user && (
              <span className="text-gray-400 text-xs font-medium">
                {user.username} • {user.role}
              </span>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="text-sm font-bold px-4 py-1.5 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-200"
              >
                Log out
              </button>
            ) : (
              <Link
                to="/login"
                className="text-sm font-bold px-4 py-1.5 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-200"
              >
                Log in <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-50 bg-black/50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <div className="w-8 h-8 bg-white flex items-center justify-center font-black text-black text-sm">
                  ST
                </div>
                <span className="text-white font-bold">Student–Teacher Meet</span>
              </Link>
              <button
                type="button"
                className="rounded-md p-2.5 text-white hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-8 flow-root">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-4 py-3 text-base font-semibold transition-all ${isActive(item.href)
                      ? 'bg-white text-black'
                      : 'text-white hover:bg-white/10'
                      }`}
                    onClick={(e) => { handleNavClick(e, item); setMobileMenuOpen(false); }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-white/20">
                {user && (
                  <p className="text-gray-400 text-sm mb-4 px-4">
                    Signed in as <span className="text-white font-bold">{user.username}</span>
                  </p>
                )}
                {user ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-base font-semibold text-white hover:bg-white/10 border-2 border-white text-center"
                  >
                    Log out
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-base font-semibold text-white hover:bg-white/10 border-2 border-white text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                )}
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      <main className="flex-grow pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white flex items-center justify-center font-black text-black text-sm">
                  ST
                </div>
                <span className="font-bold text-lg">Student–Teacher Meet</span>
              </div>
              <p className="text-gray-400 text-sm">
                Connecting students and teachers seamlessly. Book appointments, manage schedules, and stay organized.
              </p>
            </div>
            {/* Quick Links */}
            <div>
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/resources" className="hover:text-white transition-colors">Resources</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wider">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Book appointments effortlessly</li>
                <li>Real-time notifications</li>
                <li>Resource library access</li>
                <li>Secure & reliable</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-6">
            <p className="text-center text-xs text-gray-500">
              &copy; 2024 By Sujit Dedwal | Student-Teacher Meet, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
