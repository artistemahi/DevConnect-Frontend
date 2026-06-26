import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeFeed } from "../utils/feedSlice";
import { BASE_URL } from "../utils/constants";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimate,
} from "framer-motion";

const SWIPE_THRESHOLD = 120; // px — how far to drag before it counts

const UserCard = ({ user, previewMode = false }) => {
  const dispatch = useDispatch();
  const [actionLoading, setActionLoading] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [scope, animate] = useAnimate();

  // --- Motion values ---
  const x = useMotionValue(0);
  // Card tilts as it's dragged
  const rotate = useTransform(x, [-300, 0, 300], [-22, 0, 22], {
    clamp: true,
  });
  // YES badge fades in on right drag
  const yesBadgeOpacity = useTransform(x, [20, 100], [0, 1], { clamp: true });
  // NOPE badge fades in on left drag (x goes negative)
  const nopeBadgeOpacity = useTransform(x, [-20, -100], [0, 1], {
    clamp: true,
  });
  // Subtle scale-down on the card as it's being dragged
  const cardScale = useTransform(x, [-300, 0, 300], [0.96, 1, 0.96], {
    clamp: true,
  });

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

  // Fly the card off-screen in the chosen direction, then remove from store
  const flyOff = async (direction) => {
    const flyX = direction === "interested" ? 600 : -600;
    await animate(
      scope.current,
      { x: flyX, opacity: 0, rotate: direction === "interested" ? 30 : -30 },
      { duration: 0.35, ease: [0.32, 0, 0.67, 0] }
    );
    dispatch(removeFeed(_id));
  };

  const handleRequestClick = async (status) => {
    if (!_id || actionLoading) return;
    try {
      setActionLoading(status);
      await axios.post(
        BASE_URL + `/request/send/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
      await flyOff(status);
    } catch (err) {
      console.error(err);
      // Snap card back on error
      animate(scope.current, { x: 0 }, { type: "spring", stiffness: 300 });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDragEnd = async (_event, info) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      await handleRequestClick("interested");
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      await handleRequestClick("ignore");
    } else {
      // Not enough — spring back to center
      animate(scope.current, { x: 0, rotate: 0 }, { type: "spring", stiffness: 400, damping: 28 });
    }
  };

  return (
    <motion.div
      ref={scope}
      drag={previewMode ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      style={{ x, rotate, scale: previewMode ? 1 : cardScale }}
      whileTap={previewMode ? {} : { cursor: "grabbing" }}
      onDragEnd={previewMode ? undefined : handleDragEnd}
      className={`overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/90 shadow-2xl shadow-slate-950/40 ${
        !previewMode ? "cursor-grab select-none touch-pan-y" : ""
      }`}
    >
      {/* ── Photo area ── */}
      <div className="relative h-80 overflow-hidden rounded-t-[2rem] bg-slate-800">
        {/* YES stamp */}
        {!previewMode && (
          <motion.div
            style={{ opacity: yesBadgeOpacity }}
            className="pointer-events-none absolute left-5 top-5 z-10 -rotate-12 rounded-xl border-[3px] border-emerald-400 px-4 py-1.5 text-2xl font-extrabold uppercase tracking-widest text-emerald-400"
          >
            YES
          </motion.div>
        )}

        {/* NOPE stamp */}
        {!previewMode && (
          <motion.div
            style={{ opacity: nopeBadgeOpacity }}
            className="pointer-events-none absolute right-5 top-5 z-10 rotate-12 rounded-xl border-[3px] border-rose-400 px-4 py-1.5 text-2xl font-extrabold uppercase tracking-widest text-rose-400"
          >
            NOPE
          </motion.div>
        )}

        <img
          className="h-full w-full object-cover"
          src={avatarSrc}
          alt={`${fullName} profile`}
          draggable={false}
          onError={() => setImgError(true)}
        />

        {/* Gradient overlay at bottom of image */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900 to-transparent" />
      </div>

      {/* ── Info area ── */}
      <div className="space-y-4 p-6">
        <div>
          <h2 className="text-2xl font-semibold text-white">{fullName}</h2>
          <p className="mt-1 text-slate-400">{ageGender}</p>
        </div>

        <p className="text-slate-300">{about || "No details available."}</p>

        {!previewMode && (
          <>
            {/* Swipe hint — only show once per session could be done, for now always visible */}
            <p className="text-center text-xs text-slate-600 select-none">
              ← drag to ignore &nbsp;·&nbsp; drag to connect →
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => handleRequestClick("ignore")}
                disabled={!!actionLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-rose-500/15 px-5 py-3 text-sm font-semibold text-rose-300 ring-1 ring-rose-500/40 transition hover:bg-rose-500 hover:text-white disabled:opacity-40"
              >
                {actionLoading === "ignore" ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  /* ✕ icon */
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 stroke-current" fill="none" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                )}
                Ignore
              </button>

              <button
                onClick={() => handleRequestClick("interested")}
                disabled={!!actionLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-500/15 px-5 py-3 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-500/40 transition hover:bg-emerald-500 hover:text-slate-950 disabled:opacity-40"
              >
                {actionLoading === "interested" ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  /* ♥ icon */
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-current" strokeWidth="0"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                )}
                Interested
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default UserCard;