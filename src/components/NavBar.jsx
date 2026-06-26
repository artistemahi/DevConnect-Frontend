import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import { removeConnection } from "../utils/connectionSlice";
import { clearFeed } from "../utils/feedSlice";
import { clearRequests } from "../utils/requestSlice";
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
      dispatch(clearFeed());
      dispatch(clearRequests());
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
          {/* DevConnect Logo — interlocking < > with a link node */}
          <svg
            viewBox="0 0 44 44"
            className="h-9 w-9 shrink-0"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="dcGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            {/* Rounded square background */}
            <rect width="44" height="44" rx="12" fill="url(#dcGrad)" />
            {/* Left bracket < */}
            <polyline
              points="17,13 10,22 17,31"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Right bracket > */}
            <polyline
              points="27,13 34,22 27,31"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Center link dot — represents a connection node */}
            <circle cx="22" cy="22" r="2.5" fill="white" />
            {/* Small accent dot top-right */}
            <circle cx="37" cy="7" r="2" fill="white" fillOpacity="0.6" />
          </svg>
          <span className="bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-transparent">
            DevConnect
          </span>
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