import React, { useState } from "react";
import desktop from "../../src/assets/desktop.png"
import mobile from "../../src/assets/mobile.png"
import nestpro from "../../src/assets/logo.png"
import logo from "/src/assets/NestFinder Pro.png"
import { Link, useNavigate, useSearchParams } from "react-router-dom";

// ---- BACKEND REMOVED: ResetSuccess component no longer needed ----
// ---- We use Modal instead ----
// import ResetSuccess from "./ResetSuccess";

// ---- BACKEND: imported resetPassword from api service ----
import { resetPassword } from "../services/api";

// ---- BACKEND ADDED: imported Modal component ----
import Modal from "../Components/Universal/Modal";

type User = {
  password: string;
  confirmpassword: string;
};
type ErrorType = {
  password: boolean;
  confirmpassword: boolean;
};

const ResetPassword = () => {
  const [user, setUser] = useState<User>({
    password: "",
    confirmpassword: "",
  });
  const [error, setError] = useState<ErrorType>({
    password: false,
    confirmpassword: false,
  });

  // ---- BACKEND ADDED: get token from URL query params ----
  // ---- BACKEND REMOVED: // const navigate = useNavigate() was commented out ----
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ---- BACKEND ADDED: loading state ----
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ---- BACKEND REMOVED: showSuccess state no longer needed ----
  // ---- const [showSuccess, setShowSuccess] = useState(false); ----

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
    const { name, value } = e.target;
    // typescript needs help knowing that name is a key of user
    const inputFieldName = name as keyof User;
    setUser({ ...user, [inputFieldName]: value });
    // remove the error when there is a value in the input field
    setError({ ...error, [inputFieldName]: false });
  };

  // ---- BACKEND UPDATED: handleSubmit is now async and calls real backend ----
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // step 1, create a variable to catch the errors or determine if an error occured
    let hasError = false;

    // step 2, create a placeholder object for the error state
    const newError: ErrorType = {
      password: false,
      confirmpassword: false,
    };

    if (!user.password.trim()) {
      newError.password = true;
      hasError = true;
    } else if (user.password.length < 8) {
      newError.password = true;
      hasError = true;
    }

    if (!user.confirmpassword.trim()) {
      newError.confirmpassword = true;
      hasError = true;
    } else if (user.confirmpassword.length < 8) {
      newError.confirmpassword = true;
      hasError = true;
    } else if (user.confirmpassword !== user.password) {
      newError.confirmpassword = true;
      hasError = true;
    }

    if (hasError) {
      setError(newError);
      return;
    }

    // ---- BACKEND ADDED: get token from URL ----
    const token = searchParams.get("token");

    if (!token) {
      setModal({
        show: true,
        type: "error",
        message: "Invalid reset link. Please request a new one.",
      });
      return;
    }

    try {
      setIsLoading(true);

      // ---- BACKEND CALL: send new password to real backend ----
      // ---- BACKEND REMOVED: setShowSuccess(true) ----
      // ---- BACKEND REMOVED: console.log("Submitted", user) ----
      const result = await resetPassword(token, {
        password: user.password,
        confirmpassword: user.confirmpassword,
      });

      if (result.success) {
        // ---- BACKEND ADDED: show success modal ----
        setModal({
          show: true,
          type: "success",
          message: result.message || "Password reset successful! You can now log in.",
        });
      } else {
        // ---- BACKEND ADDED: show error modal ----
        setModal({
          show: true,
          type: "error",
          message: result.message || "Something went wrong. Please try again.",
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

    // reset form
    setUser({
      password: "",
      confirmpassword: "",
    });
    setError({
      password: false,
      confirmpassword: false,
    });
  };

  // ---- BACKEND ADDED: on success modal close go to login ----
  const handleModalClose = () => {
    setModal({ ...modal, show: false });
    if (modal.type === "success") {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row w-screen h-screen justify-center rounded-t-none">
      <div className="w-full">
        <form
          onSubmit={handleSubmit}
          className="md:w-[507px] w-full flex flex-col mx-auto px-4 pt-15 pb-44 md:pb-42.5 pt-4"
        >
          <div className="flex flex-col gap-3">
            <div className="flex gap-4 items-center">
              <img className="hidden md:block w-6" src={nestpro} alt="arrow" />
              <img className="hidden md:block" src={logo} alt="" />
            </div>
            <h4 className="text-[17px] md:text-[32px] font-semibold">Reset Password</h4>
            <p className="mb-4 md:mb-6 text-[11px] md:text-[13px] w-60">
              Please enter a new password to take you back to your account
            </p>
          </div>

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
            value={user.password}
            onChange={handleChange}
          />

          {/* confirm password */}
          <label
            className={`text-[13px] font-medium pb-1.5 md:pb-0 ${error.confirmpassword ? "text-red-500" : "text-black"}`}>
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Re-enter your password"
            className={`w-full h-9 md:h-11.25 p-2 border-2 text-[10px] md:text-[14px] mb-4 rounded-lg my-0 md:my-2 block focus:outline-none transition-all duration-200
              ${error.confirmpassword ? "border-red-500 placeholder-red-500 focus:ring-2 focus:ring-red-500" : "border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"}`}
            id="confirmpassword"
            name="confirmpassword"
            minLength={8}
            value={user.confirmpassword}
            onChange={handleChange}
          />

          {/* ---- BACKEND ADDED: button shows loading state ---- */}
          <button
            disabled={isLoading}
            className="w-full h-9 md:h-10 bg-[#1A3C34] rounded-lg text-white text-[14px] font-light block my-4 md:my-8 hover:bg-[#A5A8A8] hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>

          <span className="flex flex-row items-center justify-center gap-2 font-light text-[13px]">
            Already have an account?
            <Link to="/login"><u>Sign In</u></Link>
          </span>
        </form>
      </div>

      {/* images — both desktop and mobile */}
      <div className="w-full">
        <img className="hidden md:block" src={desktop} alt="desktop-img" />
        <img className="block md:hidden w-full rounded-b-lg md:rounded-b-none" src={mobile} alt="desktop-img" />
      </div>

      {/* ---- BACKEND REMOVED: ResetSuccess component ---- */}
      {/* ---- {showSuccess && <ResetSuccess />} ---- */}

      {/* ---- BACKEND ADDED: modal for success and error messages ---- */}
      {modal.show && (
        <Modal
          type={modal.type}
          message={modal.message}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default ResetPassword;