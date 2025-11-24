import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MoonIcon, SunIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const nav = useNavigate();
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    nav("/login");
  };

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-brand dark:text-indigo-300">
        Student–Teacher Meet
      </h1>

      {/* Mobile menu button */}
      <button className="md:hidden block" onClick={() => setOpen(!open)}>
        {open ? (
          <XMarkIcon className="w-7 text-gray-800 dark:text-gray-200" />
        ) : (
          <Bars3Icon className="w-7 text-gray-800 dark:text-gray-200" />
        )}
      </button>

      {/* Links */}
      <div className={`md:flex gap-6 items-center ${open ? "block" : "hidden"} md:block`}>
        {!token && (
          <>
            <Link className="nav-link" to="/">Home</Link>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/register">Register</Link>
          </>
        )}

        {token && (
          <>
            <Link className="nav-link" to="/">Home</Link>

            {role === "teacher" && (
              <Link className="nav-link" to="/teacher">Teacher Dashboard</Link>
            )}

            {role === "student" && (
              <Link className="nav-link" to="/student">Student Dashboard</Link>
            )}

            <Link className="nav-link" to="/my-bookings">My Bookings</Link>

            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}

        {/* Dark Mode Button */}
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition"
        >
          {dark ? (
            <SunIcon className="w-6 text-yellow-400" />
          ) : (
            <MoonIcon className="w-6 text-gray-800" />
          )}
        </button>
      </div>
    </nav>
  );
}
