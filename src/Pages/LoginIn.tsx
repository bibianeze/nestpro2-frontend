import desktop from "../../src/assets/desktop.png"
import mobile from "../../src/assets/mobile.png"
import nestpro from "../../src/assets/logo.png"
import logo from "/src/assets/NestFinder Pro.png"
import { Link, useNavigate } from "react-router-dom";
import React, { useState, type FC } from "react";
import { type User } from "../types";

// ---- BACKEND REMOVED: SignUpp type no longer needed ----
// import { type SignUpp } from "../types/signup";

// ---- BACKEND: imported loginUser and saveToken from api service ----
import { loginUser, saveToken } from "../services/api";

// ---- BACKEND ADDED: imported Modal component ----
import Modal from "../Components/Universal/Modal";

type Form = {
  email: string;
  password: string;
  terms: boolean;
};
type ErrorType = {
  email: boolean;
  password: boolean;
};

interface LogInProps {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: User) => void;
  // ---- BACKEND REMOVED: isSignedUp prop no longer needed ----
  // isSignedUp: SignUpp;
  setIsAdmin: (isAdmin: boolean) => void;
}

const LoginIn: FC<LogInProps> = ({ setIsLoggedIn, setUser, setIsAdmin }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>({
    email: "",
    password: "",
    terms: false,
  });
  const [error, setError] = useState<ErrorType>({
    email: false,
    password: false,
  });

  // ---- BACKEND ADDED: loading state ----
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ---- BACKEND ADDED: modal state ----
  const [modal, setModal] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputFieldName = name as keyof Form;
    setForm({ ...form, [inputFieldName]: type === "checkbox" ? checked : value });
    setError({ ...error, [inputFieldName]: false });
  };

  // ---- BACKEND UPDATED: handleSubmit is now async and calls real backend ----
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password } = form;

    if (!email.trim() || !password.trim()) {
      setError({
        email: !email.trim(),
        password: !password.trim(),
      });
      return;
    }

    // ---- BACKEND REMOVED: hardcoded admin email/password check ----
    // const adminEmail = "admin123@gmail.com";
    // const adminPassword = "admin123";
    // if (email === adminEmail && password === adminPassword) {
    //   setIsAdmin(true);
    //   setIsLoggedIn(true);
    //   setUser({ name: "Admin", email: adminEmail });
    //   navigate("/");
    //   return;
    // }

    // ---- BACKEND REMOVED: isSignedUp comparison ----
    // if (isSignedUp && email.trim() === isSignedUp.email.trim() && password === isSignedUp.password) {
    //   setIsAdmin(false);
    //   setIsLoggedIn(true);
    //   const firstName = email.split('@')[0];
    //   const formattedName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    //   setUser({ name: formattedName, email: email });
    //   navigate("/");
    //   return;
    // }

    // ---- BACKEND REMOVED: frontend error comparison ----
    // setError({
    //   email: email !== isSignedUp?.email,
    //   password: password !== isSignedUp?.password,
    // });
    // alert("Invalid credentials. Please sign up or check your details.");

    try {
      setIsLoading(true);

      // ---- BACKEND CALL: send login credentials to real backend ----
      const result = await loginUser({ email, password });

      if (result.success) {
        // ---- BACKEND ADDED: save JWT token to localStorage ----
        saveToken(result.token);

        // ---- BACKEND ADDED: set user from backend response ----
        setIsLoggedIn(true);
        setUser({ name: result.user.name, email: result.user.email });

        // ---- BACKEND ADDED: set admin state based on role from backend ----
        // ---- BACKEND ADDED: admin goes to dashboard, user goes to home ----
if (result.user.role === "admin") {
  setIsAdmin(true);
  navigate("/adminPage");
} else {
  setIsAdmin(false);
  navigate("/");
}
      } else {
        // ---- BACKEND ADDED: show error modal with backend message ----
        setModal({
          show: true,
          type: "error",
          message: result.message || "Login failed. Please try again.",
        });
      }
    } catch (error) {
      // ---- BACKEND ADDED: show error modal on network failure ----
      setModal({
        show: true,
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col-reverse w-screen md:flex-row h-screen items-center justify-center rounded-t-none">
      <div className="w-full h-full">
        <form
          onSubmit={handleSubmit}
          className="lg:w-[507px] w-full flex flex-col mx-auto my-0 md:my-8 px-4 pb-32.5 md:pb-38.5 pt-4 md:pt-6 rounded-r-none rounded-l-none"
        >
          <div className="flex flex-col gap-3">
            <div className="flex gap-4 items-center space-y-4">
              <img className="hidden md:block w-6" src={nestpro} onClick={() => navigate("/")} alt="arrow" />
              <img className="hidden md:block mb-3" src={logo} alt="" />
            </div>
            <h4 className="text-[17px] md:text-[20px] font-semibold">Log in</h4>
            <p className="mb-4 md:mb-6 text-[11px] md:text-[13px]">Welcome back, Please enter your details</p>
          </div>

          {/* email */}
          <label
            className={`text-[13px] font-medium pb-1.5 md:pb-0 ${error.email ? "text-red-500" : "text-black"}`}
            htmlFor="email">
            Email
          </label>
          <input
            type="text"
            placeholder="Enter your email"
            className={`w-full h-9 md:h-11.25 p-2 border-2 text-[10px] md:text-[14px] mb-4 rounded-lg my-0 md:my-2 block focus:outline-none transition-all duration-200
              ${error.email ? "border-red-500 placeholder-red-500 focus:ring-2 focus:ring-red-500" : "border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"}`}
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          {/* password */}
          <label
            className={`text-[13px] font-medium pb-1.5 md:pb-0 ${error.password ? "text-red-500" : "text-black"}`}
            htmlFor="password">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className={`w-full h-9 md:h-11.25 p-2 border-2 text-[10px] md:text-[14px] mb-4 rounded-lg my-0 md:my-2 block focus:outline-none transition-all duration-200
              ${error.password ? "border-red-500 placeholder-red-500 focus:ring-2 focus:ring-red-500" : "border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"}`}
            id="password"
            name="password"
            minLength={8}
            value={form.password}
            onChange={handleChange}
          />

          {/* remember me & forgot password */}
          <div className='flex flex-row justify-between md:mt-2 md:pb-6'>
            <div className='flex flex-row gap-1'>
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={form.terms}
                onChange={handleChange}
              />
              <p className='text-[12px]'>Remember Me</p>
            </div>
            <span className="text-[12px] text-red-500 hover:cursor-pointer">
              <Link to="/forgotpassword">Forgot Password?</Link>
            </span>
          </div>

          {/* ---- BACKEND ADDED: button shows loading state ---- */}
          <button
            disabled={isLoading}
            className="w-full h-9 md:h-10 bg-[#1A3C34] rounded-lg text-white text-[14px] font-light block my-6 hover:bg-[#A5A8A8] hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <span className="flex flex-row items-center justify-center gap-2 font-light text-[14px]">
            Not registered yet?
            <Link to="/signup"><u>Create an Account</u></Link>
          </span>
        </form>
      </div>

      <div className="w-full h-full">
        <img className="hidden md:block" src={desktop} alt="desktop-img" />
        <img className="block md:hidden w-full h-full" src={mobile} alt="mobile-img" />
      </div>

      {/* ---- BACKEND ADDED: modal for error messages ---- */}
      {modal.show && (
        <Modal
          type={modal.type}
          message={modal.message}
          onClose={() => setModal({ ...modal, show: false })}
        />
      )}
    </div>
  );
};

export default LoginIn;