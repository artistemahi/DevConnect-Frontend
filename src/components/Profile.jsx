import UserCard from "./UserCard";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [about, setAbout] = useState(user?.about || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const saveProfile = async () => {
    setError("");

    // Basic client-side validation
    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }
    if (age && (Number(age) < 18 || Number(age) > 100)) {
      setError("Please enter a valid age between 18 and 100.");
      return;
    }

    try {
      setSaving(true);
      const res = await axios.post(
        BASE_URL + "/profile/edit",
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          photoURL: photoURL.trim(),
          // Only send age if it's a valid number, otherwise omit
          ...(age !== "" && { age: Number(age) }),
          gender,
          about: about.trim(),
        },
        { withCredentials: true },
      );
      dispatch(addUser(res?.data?.user));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!oldPassword || !newPassword) {
      setPasswordError("Both fields are required.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (oldPassword === newPassword) {
      setPasswordError("New password must differ from the old one.");
      return;
    }

    try {
      setChangingPassword(true);
      await axios.post(
        BASE_URL + "/profile/password-change",
        { oldPassword, newPassword },
        { withCredentials: true },
      );
      setPasswordSuccess("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setPasswordError(err?.response?.data?.error || err.message);
    } finally {
      setChangingPassword(false);
    }
  };

  // Guard against rendering before user is available
  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-950 py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.35fr_0.9fr] lg:px-8">
        <div className="space-y-8">
          {/* Edit Profile */}
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold text-white">
                  Edit Profile
                </h1>
                <p className="mt-2 text-slate-400">
                  Update your developer story and keep your profile fresh.
                </p>
              </div>
              <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm font-semibold text-cyan-200">
                {user?.email}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                First Name *
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="First Name"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Last Name
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="Last Name"
                />
              </label>
            </div>

            <label className="mt-4 block text-sm text-slate-300">
              Photo URL
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                placeholder="https://..."
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                Age
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="Age"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Gender
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
            </div>

            <label className="mt-4 block text-sm text-slate-300">
              About
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                maxLength={500}
                className="mt-2 h-32 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                placeholder="Tell other developers what you do"
              />
              <span className="mt-1 block text-right text-xs text-slate-500">
                {about.length}/500
              </span>
            </label>

            {error && (
              <p className="mt-4 rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                {error}
              </p>
            )}

            <button
              onClick={saveProfile}
              disabled={saving}
              className="mt-6 w-full rounded-full bg-cyan-400 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Profile"}
            </button>
          </div>

          {/* Change Password */}
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
            <h2 className="text-2xl font-semibold text-white">
              Change Password
            </h2>
            <p className="mt-2 text-slate-400">
              Secure your account with a fresh password anytime.
            </p>

            <label className="mt-6 block text-sm text-slate-300">
              Old Password
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                placeholder="Current password"
              />
            </label>

            <label className="mt-4 block text-sm text-slate-300">
              New Password
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                placeholder="Min. 8 characters"
              />
            </label>

            {passwordError && (
              <p className="mt-4 text-sm text-rose-300">{passwordError}</p>
            )}
            {passwordSuccess && (
              <p className="mt-4 text-sm text-emerald-300">{passwordSuccess}</p>
            )}

            <button
              onClick={changePassword}
              disabled={changingPassword}
              className="mt-6 w-full rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
            >
              {changingPassword ? "Updating…" : "Update Password"}
            </button>
          </div>
        </div>

        {/* Preview column */}
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
          <h2 className="text-3xl font-semibold text-white">Profile Preview</h2>
          <p className="mt-3 text-slate-400">
            This is how your public developer card will appear.
          </p>
          <div className="mt-8">
            <UserCard
              user={{
                _id: user._id,
                firstName,
                lastName,
                photoURL,
                age,
                gender,
                about,
              }}
              previewMode
            />
          </div>
        </div>
      </div>

      {showToast && (
        <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 transform px-4">
          <div className="rounded-3xl bg-cyan-400/15 px-6 py-4 text-slate-100 shadow-2xl shadow-cyan-500/20 ring-1 ring-cyan-400/20">
            Profile saved successfully.
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;