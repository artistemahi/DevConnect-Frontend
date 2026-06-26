import NavBar from "./NavBar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import Loader from "./Loader";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((store) => store.user);
  const [loading, setLoading] = useState(false);

  // Track if a fetch is already in-flight to prevent duplicate calls
  const fetchingRef = useRef(false);

  const publicRoutes = ["/", "/login", "/signup"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  useEffect(() => {
    // Skip fetch on public routes or if user is already in store
    if (isPublicRoute || user) return;
    // Prevent concurrent fetches
    if (fetchingRef.current) return;

    const controller = new AbortController();

    const fetchUser = async () => {
      try {
        fetchingRef.current = true;
        setLoading(true);

        const res = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
          signal: controller.signal,
        });

        dispatch(addUser(res.data.user));
      } catch (err) {
        // Ignore aborted requests (component unmounted)
        if (axios.isCancel(err)) return;

        if (err?.response?.status === 401) {
          navigate("/login", { replace: true });
        }
        // For other errors (network, 5xx) we just leave the user on the page;
        // protected routes will redirect if needed.
      } finally {
        fetchingRef.current = false;
        setLoading(false);
      }
    };

    fetchUser();

    return () => {
      // Cancel the in-flight request when the effect re-runs or component unmounts
      controller.abort();
    };
  }, [location.pathname, user, isPublicRoute, dispatch, navigate]);

  if (loading && !isPublicRoute) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />
      <main className="min-h-[calc(100vh-72px)]">
        <Outlet />
      </main>
    </div>
  );
};

export default Body;