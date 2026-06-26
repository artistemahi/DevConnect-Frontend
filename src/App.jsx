import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { useState } from "react";
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
import { AuthContext } from "./utils/AuthContext";

function App() {
  const [initialising, setInitialising] = useState(true);

  return (
    <Provider store={AppStore}>
      <AuthContext.Provider value={{ initialising, setInitialising }}>
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
                  <ProtectedRoute initialising={initialising}>
                    <Feed />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute initialising={initialising}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="connection"
                element={
                  <ProtectedRoute initialising={initialising}>
                    <Connection />
                  </ProtectedRoute>
                }
              />
              <Route
                path="request"
                element={
                  <ProtectedRoute initialising={initialising}>
                    <Request />
                  </ProtectedRoute>
                }
              />

              {/* Unknown routes → home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </Provider>
  );
}

export default App;