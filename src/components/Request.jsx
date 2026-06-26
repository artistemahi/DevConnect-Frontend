import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { addRequest, removeRequest } from "../utils/requestSlice";
import { BASE_URL } from "../utils/constants";
import Loader from "./Loader";

const Request = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.request);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Track which request IDs are currently being acted on to prevent double-clicks
  const [processingIds, setProcessingIds] = useState(new Set());

  useEffect(() => {
    const controller = new AbortController();

    const fetchRequest = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(BASE_URL + "/user/requests/received", {
          withCredentials: true,
          signal: controller.signal,
        });
        dispatch(addRequest(res.data.data ?? []));
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError("Failed to load requests. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();

    return () => controller.abort();
  }, [dispatch]);

  const reviewRequest = async (status, requestId) => {
    if (processingIds.has(requestId)) return; // Prevent double-click

    try {
      setProcessingIds((prev) => new Set(prev).add(requestId));
      await axios.post(
        BASE_URL + `/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true },
      );
      dispatch(removeRequest(requestId));
    } catch (err) {
      console.error(err);
      // Show a non-blocking error (could upgrade to a toast)
      setError("Action failed. Please try again.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-950 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-white">Requests</h1>
          <p className="mt-2 text-slate-400">
            Review developer connection requests and keep your inbox clean.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-[2rem] border border-rose-800 bg-rose-900/20 p-4 text-center text-sm text-rose-300">
            {error}
          </div>
        )}

        {!requests || requests.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-16 text-center text-slate-400 shadow-2xl shadow-slate-950/40">
            No requests found.
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map((request) => {
              const { firstName, lastName, age, gender, photoURL, about } =
                request.fromUserId;
              const isProcessing = processingIds.has(request._id);

              return (
                <div
                  key={request._id}
                  className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/40 transition hover:-translate-y-1"
                >
                  <div className="flex flex-col gap-6 xl:flex-row xl:items-center">
                    <img
                      src={
                        photoURL ||
                        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      }
                      alt={`${firstName ?? "User"} avatar`}
                      className="h-32 w-32 rounded-3xl object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                      }}
                    />
                    <div className="flex-1 space-y-3">
                      <div>
                        <h2 className="text-2xl font-semibold text-white">
                          {firstName} {lastName}
                        </h2>
                        {(age || gender) && (
                          <p className="mt-1 text-slate-400">
                            {[age && `${age} years`, gender]
                              .filter(Boolean)
                              .join(" • ")}
                          </p>
                        )}
                      </div>
                      <p className="text-slate-300">
                        {about || "No bio available."}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <button
                          disabled={isProcessing}
                          onClick={() =>
                            reviewRequest("rejected", request._id)
                          }
                          className="rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:opacity-50"
                        >
                          {isProcessing ? "Processing…" : "Ignore"}
                        </button>
                        <button
                          disabled={isProcessing}
                          onClick={() =>
                            reviewRequest("accepted", request._id)
                          }
                          className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
                        >
                          {isProcessing ? "Processing…" : "Accept"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Request;