import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard.jsx";
import { BASE_URL } from "../utils/constants";
import Loader from "./Loader.jsx";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.feed);

  const [hasFetched, setHasFetched] = useState(false);
  const [error, setError] = useState("");

  const feedRef = useRef(feed);

  useEffect(() => {
    feedRef.current = feed;
  }, [feed]);

  useEffect(() => {
    if (feedRef.current && feedRef.current.length > 0) {
      setHasFetched(true);
      return;
    }

    const controller = new AbortController();

    const getFeed = async () => {
      try {
        setError("");

        const res = await axios.get(BASE_URL + "/user/feed", {
          withCredentials: true,
          signal: controller.signal,
        });

        dispatch(addFeed(res?.data?.data ?? []));
      } catch (err) {
        if (axios.isCancel(err)) return;

        console.error(err);
        setError("Failed to load feed. Please refresh.");
      } finally {
        setHasFetched(true);
      }
    };

    getFeed();

    return () => controller.abort();
  }, [dispatch]);

  const loading = !hasFetched && (!feed || feed.length === 0);

  const summary = (() => {
    if (loading) return "Loading developers...";
    if (!feed || feed.length === 0)
      return "No profiles available yet.";

    return `Showing ${feed.length} developer${
      feed.length > 1 ? "s" : ""
    } ready to connect.`;
  })();

  if (loading) return <Loader />;

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-950 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-white">
                Discover Developers
              </h1>

              <p className="mt-3 max-w-2xl text-slate-400">
                Explore matching developer profiles, send interest requests,
                and grow your collaboration network.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-950/80 px-5 py-4 text-slate-200 shadow-inner shadow-cyan-500/10">
              {summary}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-[2rem] border border-rose-800 bg-rose-900/20 p-6 text-center text-rose-300">
            {error}
          </div>
        )}

        {/* Tinder Stack */}
        <div className="mt-12 flex justify-center">
          {feed && feed.length > 0 ? (
            <div className="relative h-[650px] w-[380px]">
              {feed
                .slice()
                .reverse()
                .map((user, index, arr) => {
                  // After reverse: index 0 = last/background card, index arr.length-1 = top card
                  const depth = arr.length - 1 - index; // 0 = top card, increases going back
                  return (
                    <div
                      key={user._id}
                      className="absolute w-full"
                      style={{
                        zIndex: index, // highest index = top card ✓
                        transform: `scale(${1 - depth * 0.04}) translateY(${depth * 10}px)`,
                      }}
                    >
                      <UserCard user={user} />
                    </div>
                  );
                })}
            </div>
          ) : (
            !error && (
              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-16 text-center text-slate-400 shadow-2xl shadow-slate-950/40">
                <p className="mb-4 text-2xl font-semibold text-white">
                  No developers right now
                </p>

                <p className="mx-auto max-w-xl text-slate-400">
                  Update your profile, come back later, or browse requests to
                  build your network.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;