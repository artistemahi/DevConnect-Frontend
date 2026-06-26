import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [email, setEmail] = useState("demo@gmail.com");
  const [password, setPassword] = useState("Demo@1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginHandler = async () => {
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        BASE_URL + "/login",
        { email: email.trim(), password },
        { withCredentials: true },
      );
      dispatch(addUser(response.data.user));
      navigate("/feed", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Allow submitting via Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") loginHandler();
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-950 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="flex flex-col justify-center rounded-[2rem] border border-slate-800 bg-slate-900/90 p-10 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="mb-8">
            <p className="mb-3 inline-flex rounded-full bg-cyan-400/15 px-4 py-1 text-sm font-semibold text-cyan-200">
              Welcome back
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Login to your developer network
            </h1>
            <p className="mt-4 max-w-xl text-slate-400">
              Sign in and start discovering new developer profiles, review
              requests, and build a meaningful collaboration network.
            </p>
          </div>

          <div className="space-y-4 rounded-[1.75rem] bg-slate-950/80 p-6 shadow-inner shadow-cyan-500/10">
            <label className="block text-sm font-medium text-slate-300">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="you@example.com"
                autoComplete="email"
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </label>

            <label className="block text-sm font-medium text-slate-300">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </label>

            {error && (
              <p className="rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              onClick={loginHandler}
              className="mt-2 w-full rounded-full bg-cyan-400 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
            >
              {loading ? "Logging in…" : "Login"}
            </button>
          </div>

          <p className="mt-6 text-sm text-slate-400">
            New here?{" "}
            <Link
              to="/signup"
              className="font-semibold text-cyan-300 hover:text-cyan-200"
            >
              Create an account
            </Link>
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-gradient-to-br from-cyan-500/10 to-slate-900/50 p-10 shadow-2xl shadow-cyan-500/10">
          <h2 className="text-3xl font-semibold text-white">What you can do</h2>
          <p className="mt-4 text-slate-300">
            Browse developer profiles, send collaboration requests, and manage
            your connections with a clean modern interface.
          </p>
          <div className="mt-10 space-y-4">
            {[
              "Explore new developer profiles.",
              "Respond to incoming connection requests.",
              "Update your bio and photo anytime.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5"
              >
                <p className="text-slate-200">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;