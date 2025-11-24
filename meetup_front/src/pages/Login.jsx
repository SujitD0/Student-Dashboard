import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api/api';
import { jwtDecode } from "jwt-decode";
import { User, Lock, Mail } from 'lucide-react';

const Login = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'student', subject: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/register') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location]);

  const login = async (email, password) => {
    try {
      const res = await API.post('token/', { username: email, password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const register = async (data) => {
    try {
      const payload = {
        username: data.email,
        email: data.email,
        password: data.password,
        first_name: data.name.split(' ')[0],
        last_name: data.name.split(' ')[1] || '',
        role: data.role,
      };
      await API.post('register/', payload);
      return true;
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const success = await login(formData.email, formData.password);
      if (success) {
        // Decode token to get role
        const token = localStorage.getItem('access_token');
        const decoded = jwtDecode(token);
        navigate(decoded.role === 'teacher' ? '/teacher' : '/student');
      } else {
        alert('Invalid credentials');
      }
    } else {
      try {
        await register(formData);
        alert('Registered! Please login.');
        setIsLogin(true);
        navigate('/login');
      } catch (e) {
        alert('Registration failed: ' + (e.response?.data?.detail || e.message));
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent p-4">
      <div className="card max-w-md w-full">
        <h2 className="text-3xl font-black mb-6 text-center uppercase tracking-tighter">
          {isLogin ? 'System Access' : 'Join Portal'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block font-bold mb-1">Full Name</label>
                <div className="flex items-center border-2 border-primary p-2 bg-white">
                  <User size={20} />
                  <input required type="text" placeholder="John Doe" className="w-full ml-2 outline-none"
                    onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Role</label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer border-2 border-transparent hover:border-primary p-1">
                    <input type="radio" name="role" value="student" checked={formData.role === 'student'}
                      onChange={() => setFormData({ ...formData, role: 'student' })} className="mr-2" />
                    Student
                  </label>
                  <label className="flex items-center cursor-pointer border-2 border-transparent hover:border-primary p-1">
                    <input type="radio" name="role" value="teacher" checked={formData.role === 'teacher'}
                      onChange={() => setFormData({ ...formData, role: 'teacher' })} className="mr-2" />
                    Teacher
                  </label>
                </div>
              </div>

              {formData.role === 'teacher' && (
                <div>
                  <label className="block font-bold mb-1">Subject Specialization</label>
                  <input type="text" placeholder="e.g. Physics" className="input-field"
                    onChange={e => setFormData({ ...formData, subject: e.target.value })} />
                </div>
              )}
            </>
          )}

          <div>
            <label className="block font-bold mb-1">Email</label>
            <div className="flex items-center border-2 border-primary p-2 bg-white">
              <Mail size={20} />
              <input required type="email" placeholder="user@school.com" className="w-full ml-2 outline-none"
                onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1">Password</label>
            <div className="flex items-center border-2 border-primary p-2 bg-white">
              <Lock size={20} />
              <input required type="password" placeholder="••••••" className="w-full ml-2 outline-none"
                onChange={e => setFormData({ ...formData, password: e.target.value })} />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full mt-6">
            {isLogin ? 'Enter Portal' : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm cursor-pointer hover:underline" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "New user? Register here." : "Already have an account? Login."}
        </p>
      </div>
    </div>
  );
};

export default Login;