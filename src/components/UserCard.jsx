import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeFeed } from "../utils/feedSlice";
import { BASE_URL } from "../utils/constants";

/**
 * @param {object}  user        - User object from feed or profile preview
 * @param {boolean} previewMode - When true, action buttons are hidden (used in Profile)
 */
const UserCard = ({ user, previewMode = false }) => {
  const dispatch = useDispatch();
  const [actionLoading, setActionLoading] = useState(null); // "ignore" | "interested" | null
  const [imgError, setImgError] = useState(false);

  if (!user) {
    return (
      <p className="text-center text-2xl font-bold text-slate-100">
        No user found
      </p>
    );
  }

  const { _id, firstName, lastName, photoURL, age, gender, about } = user;
  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || "No name";
  const ageGender =
    [age && `${age} yrs`, gender].filter(Boolean).join(" • ") ||
    "No details available";

  const avatarSrc =
    !imgError && photoURL
      ? photoURL
      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  const handleRequestClick = async (status) => {
    if (!_id || actionLoading) return; // Guard against missing id or double-click
    try {
      setActionLoading(status);
      await axios.post(
        BASE_URL + `/request/send/${status}/${_id}`,
        {},
        { withCredentials: true },
      );
      dispatch(removeFeed(_id));
    } catch (err) {
      console.error(err);
      // Could surface a toast here in a future iteration
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/90 shadow-2xl shadow-slate-950/40 transition hover:-translate-y-1 hover:border-cyan-400/30">
      <div className="relative h-80 overflow-hidden rounded-t-[2rem] bg-slate-800">
        <img
          className="h-full w-full object-cover"
          src={avatarSrc}
          alt={`${fullName} profile`}
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-5" />
      </div>

      <div className="space-y-4 p-6">
        <div>
          <h2 className="text-2xl font-semibold text-white">{fullName}</h2>
          <p className="mt-1 text-slate-400">{ageGender}</p>
        </div>

        <p className="text-slate-300">{about || "No details available."}</p>

        {!previewMode && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleRequestClick("ignore")}
              disabled={!!actionLoading}
              className="rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:opacity-50"
            >
              {actionLoading === "ignore" ? "Ignoring…" : "Ignore"}
            </button>
            <button
              onClick={() => handleRequestClick("interested")}
              disabled={!!actionLoading}
              className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
            >
              {actionLoading === "interested" ? "Sending…" : "Interested"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;