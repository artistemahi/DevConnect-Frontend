import NavBar from "./NavBar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useContext } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import { AuthContext } from "../utils/AuthContext";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((store) => store.user);
  const { setInitialising } = useContext(AuthContext);

  // Track if a fetch is already in-flight to prevent duplicate calls
  const fetchingRef = useRef(false);

  const publicRoutes = ["/", "/login", "/signup"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  useEffect(() => {
    // On public routes, we're not initialising a protected session
    if (isPublicRoute) {
      setInitialising(false);
      return;
    }
    // If user is already in store, no need to fetch
    if (user) {
      setInitialising(false);
      return;
    }
    // Prevent concurrent fetches
    if (fetchingRef.current) return;

    const controller = new AbortController();

    const fetchUser = async () => {
      try {
        fetchingRef.current = true;

        const res = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
          signal: controller.signal,
        });

        dispatch(addUser(res.data.user));
      } catch (err) {
        if (axios.isCancel(err)) return;

        if (err?.response?.status === 401) {
          navigate("/login", { replace: true });
        }
      } finally {
        fetchingRef.current = false;
        setInitialising(false);
      }
    };

    fetchUser();

    return () => {
      controller.abort();
    };
  }, [location.pathname, user, isPublicRoute, dispatch, navigate, setInitialising]);

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