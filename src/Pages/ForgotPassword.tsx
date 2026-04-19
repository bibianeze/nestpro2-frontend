import React, { useState } from "react";
import desktop from "../../src/assets/desktop.png"
import mobile from "../../src/assets/mobile.png"
import nestpro from "../../src/assets/logo.png"
import logo from "/src/assets/NestFinder Pro.png"
import { Link, useNavigate } from "react-router-dom";

// ---- BACKEND: imported forgotPassword from api service ----
import { forgotPassword } from "../services/api";

// ---- BACKEND ADDED: imported Modal component ----
import Modal from "../Components/Universal/Modal";

type User = {
  email: string;
};
type ErrorType = {
  email: boolean;
};

const ForgotPassword = () => {
  const [user, setUser] = useState<User>({ email: "" });
  const [error, setError] = useState<ErrorType>({ email: false });
  const navigate = useNavigate();

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
    const newError: ErrorType = { email: false };

    if (!user.email.trim() || !user.email.includes("@")) {
      newError.email = true;
      hasError = true;
    }

    if (hasError) {
      setError(newError);
      return;
    }

    try {
      setIsLoading(true);

      // ---- BACKEND CALL: send email to real backend ----
      // ---- BACKEND REMOVED: navigate("/resetpassword") directly ----
      // ---- BACKEND REMOVED: navigate("/resetpassword", { state: { email: user.email } }) ----
      // ---- Now the backend sends a real reset email with a token link ----
      const result = await forgotPassword(user.email);

      if (result.success) {
        // ---- BACKEND ADDED: show success modal then go to login ----
        setModal({
          show: true,
          type: "success",
          message: result.message || "Password reset link sent! Please check your email.",
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
    setUser({ email: "" });
    setError({ email: false });
  };

  // ---- BACKEND ADDED: on success modal close go to login ----
  const handleModalClose = () => {
    setModal({ ...modal, show: false });
    if (modal.type === "success") {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row h-screen w-screen justify-center rounded-t-none rounded-r-none">
      <div className="w-full">
        <form
          onSubmit={handleSubmit}
          className="w-[320px] md:w-[507px] w-full flex flex-col mx-auto my-0 md:my-12 px-4 pt-8 pb-56 md:pb-70 pt-4 md:pt-7"
        >
          <div className="flex flex-col gap-3">
            <div className="flex gap-4 items-center">
              <img className="hidden md:block w-6" src={nestpro} alt="arrow" />
              <img className="hidden md:block" src={logo} alt="" />
            </div>
            <h4 className="text-[17px] md:text-[32px] font-semibold">Forgot Password</h4>
            <p className="mb-4 md:mb-6 text-[11px] md:text-[13px]">Welcome back, Please enter your details</p>
            <label
              className={`text-[13px] font-medium ${error.email ? "text-red-500" : "text-black"}`}
              htmlFor="email">
              Email
            </label>
          </div>

          <input
            type="text"
            placeholder={error.email ? "Enter your email" : "Enter your email"}
            className={`w-full h-9 md:h-11.25 p-2 border-2 text-[10px] md:text-[14px] mb-4 rounded-lg my-0 md:my-2 block focus:outline-none transition-all duration-200
              ${error.email ? "border-red-500 placeholder-red-500 focus:ring-2 focus:ring-red-500" : "border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"}`}
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />

          {/* ---- BACKEND ADDED: button shows loading state ---- */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-9 md:h-10 bg-[#1A3C34] rounded-lg text-white text-[14px] font-light block my-6 hover:bg-[#A5A8A8] hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? "Sending..." : "Recover Password"}
          </button>

          <span className="hidden md:flex md:flex-row items-center justify-center gap-2 font-light text-[13px]">
            Already have an account?
            <Link to="/login"><u>Sign In</u></Link>
          </span>
        </form>
      </div>

      <div className="w-full">
        <img className="hidden md:block" src={desktop} alt="desktop-img" />
        <img className="block md:hidden w-full" src={mobile} alt="desktop-img" />
      </div>

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

export default ForgotPassword;