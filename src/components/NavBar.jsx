import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import { removeConnection } from "../utils/connectionSlice";
import { BASE_URL } from "../utils/constants";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logOutClickHandler = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
    } catch (err) {
      // Even if the server call fails, clear local state so the user isn't stuck
      console.error(err);
    } finally {
      dispatch(removeUser());
      dispatch(removeConnection());
      setMenuOpen(false);
      setDropdownOpen(false);
      navigate("/login");
    }
  };

  // Only show authenticated nav links when a user is logged in
  const authNavLinks = [
    { href: "/feed", label: "Browse" },
    { href: "/connection", label: "Connections" },
    { href: "/request", label: "Requests" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 text-xl font-semibold tracking-tight text-slate-100"
          onClick={() => {
            setMenuOpen(false);
            setDropdownOpen(false);
          }}
        >
          <svg
            viewBox="0 0 50 50"
            className="h-10 w-10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="devLogo" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#06b6d4", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#3b82f6", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <rect x="4" y="4" width="36" height="36" rx="8" fill="url(#devLogo)" />
            <text x="16" y="20" fontSize="12" fontWeight="bold" fill="white" fontFamily="monospace">&lt;</text>
            <line x1="24" y1="12" x2="24" y2="24" stroke="white" strokeWidth="2" />
            <text x="28" y="20" fontSize="12" fontWeight="bold" fill="white" fontFamily="monospace">&gt;</text>
            <circle cx="12" cy="28" r="2.5" fill="white" />
            <path d="M 10 32 Q 10 30 12 30 Q 14 30 14 32" fill="white" />
            <circle cx="24" cy="26" r="3" fill="white" />
            <path d="M 21 31 Q 21 28.5 24 28.5 Q 27 28.5 27 31" fill="white" />
            <circle cx="36" cy="28" r="2.5" fill="white" />
            <path d="M 34 32 Q 34 30 36 30 Q 38 30 38 32" fill="white" />
            <circle cx="40" cy="8" r="2" fill="#06b6d4" />
          </svg>
          <span>DevConnect</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Mobile hamburger — only show when logged in */}
          {user && (
            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 transition hover:border-cyan-400 md:hidden"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="2">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          )}

          {/* Desktop nav */}
          <nav className="hidden items-center gap-4 md:flex" aria-label="Main navigation">
            {user &&
              authNavLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-slate-300 transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
          </nav>

          {/* Auth buttons / avatar */}
          {!user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-800"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            /* Custom dropdown — no DaisyUI dependency */
            <div className="relative hidden md:block">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-700 ring-2 ring-transparent transition hover:ring-cyan-400"
                aria-label="User menu"
                aria-expanded={dropdownOpen}
              >
                <img
                  src={
                    user.photoURL ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  alt="User avatar"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                  }}
                />
              </button>

              {dropdownOpen && (
                <>
                  {/* Backdrop to close dropdown on outside click */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                    aria-hidden="true"
                  />
                  <ul className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 py-1 shadow-2xl">
                    {authNavLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          to={link.href}
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <hr className="my-1 border-slate-800" />
                    </li>
                    <li>
                      <button
                        onClick={logOutClickHandler}
                        className="w-full px-4 py-2.5 text-left text-sm text-rose-400 transition hover:bg-slate-800"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && user && (
        <div className="border-t border-slate-800/80 bg-slate-950/95 px-4 py-4 md:hidden">
          <div className="space-y-3">
            {authNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-3xl px-4 py-3 text-base font-medium text-slate-100 transition hover:bg-slate-900"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={logOutClickHandler}
              className="w-full rounded-3xl bg-rose-500 px-4 py-3 text-left text-base font-semibold text-white transition hover:bg-rose-400"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;