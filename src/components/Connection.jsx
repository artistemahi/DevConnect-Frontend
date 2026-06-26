import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { BASE_URL } from "../utils/constants";
import Loader from "./Loader";

const Connection = () => {
  const connection = useSelector((store) => store.connection);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const controller = new AbortController();

    const fetchConnection = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(BASE_URL + "/user/connections", {
          withCredentials: true,
          signal: controller.signal,
        });
        dispatch(addConnection(res.data.data ?? []));
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError("Failed to load connections. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConnection();

    return () => controller.abort();
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-950 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-white">
              Your Connections
            </h1>
            <p className="mt-2 text-slate-400">
              All approved developer connections appear here.
            </p>
          </div>
          <span className="inline-flex rounded-full bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200">
            {connection?.length ?? 0} connections
          </span>
        </div>

        {error && (
          <div className="mb-6 rounded-[2rem] border border-rose-800 bg-rose-900/20 p-6 text-center text-rose-300">
            {error}
          </div>
        )}

        {!error && connection?.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-16 text-center text-slate-400 shadow-2xl shadow-slate-950/40">
            No connections found yet. Browse the feed to send requests.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {connection.map((connectionItem) => {
              const { firstName, lastName, age, gender, photoURL, about, _id } =
                connectionItem;
              return (
                <div
                  key={_id}
                  className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/40 transition hover:-translate-y-1"
                >
                  <div className="flex items-center gap-5">
                    <img
                      className="h-24 w-24 rounded-3xl object-cover"
                      src={
                        photoURL ||
                        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      }
                      alt={`${firstName ?? "User"} avatar`}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                      }}
                    />
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
                  </div>
                  <p className="mt-6 text-slate-300">
                    {about || "No additional details available."}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connection;