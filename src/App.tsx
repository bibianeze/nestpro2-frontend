import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import PropertyPage from "./Pages/PropertyListing";
import HomePage from "./Pages/Home";
import HeaderNavBar from "./Components/Universal/HeaderNavBar";
import { type User } from "./types";

// ---- BACKEND REMOVED: SignUpp type no longer needed ----
// import { type SignUpp } from './types/signup';

import "./App.css";
import LogIn from "./Pages/LoginIn";
import SignUp from "./Pages/SignUp";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import Footer from "./Components/Universal/Footer";
import SignInModal from "./Components/Universal/SignInModal";
import PropertyDetails from "./Pages/PropertyDetails";
import Error404 from "./Pages/Error404";
import VerifyEmail from "./Pages/VerifyEmail";
import ProtectedRoute from "./Components/Universal/ProtectedRoute";
import AdminPage from "./Pages/AdminPage";

// ---- BACKEND: imported getCurrentUser and getToken from api service ----
import { getCurrentUser, getToken, removeToken } from "./services/api";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User>({ name: "", email: "" });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // ---- BACKEND REMOVED: isSignedUp state no longer needed ----
  // const [isSignedUp, setIsSignedUp] = useState<SignUpp>({ email: '', password: '' });

  // ---- BACKEND ADDED: loading state while checking token on refresh ----
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  const location = useLocation();
  const path =
    location.pathname !== "/login" &&
    location.pathname !== "/signup" &&
    location.pathname !== "/forgotpassword" &&
    location.pathname !== "/resetpassword" &&
    !location.pathname.startsWith("/adminPage");

  // ---- BACKEND ADDED: check token on every page refresh ----
  // ---- This keeps the user logged in after refresh ----
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();

      if (!token) {
        // No token found — user is not logged in
        setIsCheckingAuth(false);
        return;
      }

      try {
        // ---- BACKEND CALL: verify token and get user data ----
        const result = await getCurrentUser();

        if (result.success) {
          // Token is valid — restore auth state
          setIsLoggedIn(true);
          setUser({ name: result.user.name, email: result.user.email });
          setIsAdmin(result.user.role === "admin");
        } else {
          // Token is invalid or expired — clear it
          removeToken();
          setIsLoggedIn(false);
        }
      } catch (error) {
        // Network error — clear token
        removeToken();
        setIsLoggedIn(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // ---- BACKEND ADDED: show nothing while checking auth on refresh ----
  // ---- Prevents flash of wrong UI state ----
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 rounded-full border-4 border-[#1A3C34] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <>
      {path && (
        // <HeaderNavBar
        //   isLoggedIn={isLoggedIn}
        //   setIsLoggedIn={setIsLoggedIn}
        //   user={user}
        //   setUser={setUser}
        //   setShowModal={setShowModal}
        //   isAdmin={isAdmin}
        // />
        <HeaderNavBar
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          user={user}
          setUser={setUser}
          setShowModal={setShowModal}
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
        />
      )}

      <Routes>
        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
        <Route path="/home" element={<Navigate to="/" />} />

        {/* ---- BACKEND REMOVED: isSignedUp prop removed from login ---- */}
        {/* without backend */}
        {/* <Route path="/login" element={<LogIn setIsLoggedIn={setIsLoggedIn} setUser={setUser} isSignedUp={isSignedUp} setIsAdmin={setIsAdmin}/>}/> */}

        {/* with backend */}
        <Route
          path="/login"
          element={
            <LogIn
              setIsLoggedIn={setIsLoggedIn}
              setUser={setUser}
              setIsAdmin={setIsAdmin}
            />
          }
        />

        {/* ---- BACKEND REMOVED: setIsSignedUp prop removed from signup ---- */}
        {/* without backend */}
        {/* <Route path="/signup" element={<SignUp setIsSignedUp={setIsSignedUp}/>}/> */}

        {/* with backend */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
          <Route
            path="/property"
            element={
              <PropertyPage
                isLoggedIn={isLoggedIn}
                setShowModal={setShowModal}
              />
            }
          />
          <Route path="/property/:id" element={<PropertyDetails />} />
        </Route>

        <Route
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              isAdmin={isAdmin}
              adminOnly={true}
            />
          }
        >
          <Route path="/adminPage/*" element={<AdminPage />} />
        </Route>

        <Route path="*" element={<Error404 />} />
      </Routes>

      {showModal && <SignInModal setShowModal={setShowModal} />}
      {path && <Footer isLoggedIn={isLoggedIn} setShowModal={setShowModal} />}
    </>
  );
}

export default App;
