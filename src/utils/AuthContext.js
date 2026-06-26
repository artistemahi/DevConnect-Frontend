import { createContext } from "react";

// Shared context so Body.jsx can signal ProtectedRoute that session is still loading.
// Kept in its own file so react-refresh/only-export-components is satisfied.
export const AuthContext = createContext({
  initialising: true,
  setInitialising: () => {},
});