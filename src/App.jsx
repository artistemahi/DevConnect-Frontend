import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import AppStore from "./utils/appStore";
import Feed from "./components/Feed";
import SignUp from "./components/SignUp";
import Connection from "./components/Connection";
import Request from "./components/Request";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Provider store={AppStore}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}>
            {/* Public routes */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />

            {/* Protected routes — redirect to /login if unauthenticated */}
            <Route
              path="feed"
              element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="connection"
              element={
                <ProtectedRoute>
                  <Connection />
                </ProtectedRoute>
              }
            />
            <Route
              path="request"
              element={
                <ProtectedRoute>
                  <Request />
                </ProtectedRoute>
              }
            />

            {/* Unknown routes → home (keeps the NavBar visible) */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;