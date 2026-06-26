import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addUser } from "../utils/userSlice";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect away from signup
  useEffect(() => {
    if (user) navigate("/feed", { replace: true });
  }, [user, navigate]);

  const validate = () => {
    if (!firstName.trim()) return "First name is required.";
    if (!email.trim()) return "Email is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address.";
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (age && (Number(age) < 18 || Number(age) > 100))
      return "Age must be between 18 and 100.";
    return null;
  };

  const signup = async () => {
    setError("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        BASE_URL + "/signup",
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
          ...(age !== "" && { age: Number(age) }),
          gender,
        },
        { withCredentials: true },
      );
      dispatch(addUser(res?.data?.data));
      // Show the toast, THEN navigate so the toast is actually visible
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate("/profile", { replace: true });
      }, 2000);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") signup();
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-950 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        {/* Left info panel */}
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-10 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <p className="mb-4 inline-flex rounded-full bg-cyan-400/15 px-4 py-1 text-sm font-semibold text-cyan-200">
            Create your developer profile
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Start connecting with developers
          </h1>
          <p className="mt-4 max-w-xl text-slate-400">
            Fill in your details and join an elegant developer network with
            request tracking and profile management.
          </p>
          <div className="mt-10 space-y-4">
            {[
              "Secure login with JWT and cookies.",
              "Filter connections and requests easily.",
              "Update your developer bio anytime.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5"
              >
                <p className="text-slate-200">{item}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-cyan-300 hover:text-cyan-200"
            >
              Login here
            </Link>
          </p>
        </div>

        {/* Right form panel */}
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-10 shadow-2xl shadow-slate-950/40">
          <h2 className="text-3xl font-semibold text-white">Sign Up</h2>
          <p className="mt-3 text-slate-400">
            Create your profile and start browsing developer requests.
          </p>

          <div className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                First Name *
                <input
                  type="text"
                  className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="given-name"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Last Name
                <input
                  type="text"
                  className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="family-name"
                />
              </label>
            </div>

            <label className="space-y-2 text-sm text-slate-300">
              Email *
              <input
                type="email"
                className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="email"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              Password *
              <input
                type="password"
                className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="new-password"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                Age
                <input
                  type="number"
                  min="18"
                  max="100"
                  className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Gender
                <select
                  className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
            </div>

            {error && (
              <p className="rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              onClick={signup}
              className="w-full rounded-full bg-cyan-400 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
            >
              {loading ? "Creating Account…" : "Create Account"}
            </button>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="fixed inset-x-0 bottom-8 mx-auto max-w-2xl px-4 sm:px-6">
          <div className="rounded-3xl border border-cyan-400/25 bg-cyan-400/10 p-4 text-center text-cyan-100 shadow-2xl shadow-cyan-500/20">
            Sign up successful! Setting up your profile…
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;