import { Link } from "react-router-dom";
import desktop from "../../src/assets/desktop.png"
import mobile from "../../src/assets/mobile.png"
import nestpro from "../../src/assets/logo.png"
import logo from "/src/assets/NestFinder Pro.png"
import { useNavigate } from "react-router-dom";
import React, { useState, type FC } from "react";

// ---- BACKEND: imported registerUser from api service ----
import { registerUser } from "../services/api";

// ---- BACKEND ADDED: imported Modal component for error/success messages ----
import Modal from "../Components/Universal/Modal";

// ---- BACKEND REMOVED: SignUpp type and setIsSignedUp prop no longer needed ----
// ---- The real backend handles user creation now ----

type Form = {
  email: string;
  password: string;
  confirmpassword: string;
  terms: boolean;
};
type ErrorType = {
  email: boolean;
  password: boolean;
  confirmpassword: boolean;
  terms: boolean;
};

// ---- BACKEND REMOVED: SignUpProps interface with setIsSignedUp removed ----
const SignUp: FC = () => {
  const [form, setForm] = useState<Form>({
    email: "",
    password: "",
    confirmpassword: "",
    terms: false,
  });
  const [error, setError] = useState<ErrorType>({
    email: false,
    password: false,
    confirmpassword: false,
    terms: false,
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

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputFieldName = name as keyof Form;
    setForm({ ...form, [inputFieldName]: type === "checkbox" ? checked : value });
    setError({ ...error, [inputFieldName]: false });
  };

  // ---- BACKEND UPDATED: handleSubmit is now async and calls real backend ----
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasError = false;
    const newError: ErrorType = {
      email: false,
      password: false,
      confirmpassword: false,
      terms: false,
    };

    if (!form.email.trim() || !form.email.includes("@")) {
      newError.email = true;
      hasError = true;
    }

    if (!form.password.trim() || form.password.length < 8) {
      newError.password = true;
      hasError = true;
    }

    if (!form.confirmpassword.trim() || form.confirmpassword !== form.password) {
      newError.confirmpassword = true;
      hasError = true;
    }

    if (!form.terms) {
      newError.terms = true;
      // ---- BACKEND UPDATED: show modal instead of alert ----
      setModal({
        show: true,
        type: "error",
        message: "You must agree to the terms and conditions.",
      });
      hasError = true;
    }

    if (hasError) {
      setError(newError);
      return;
    }

    try {
      setIsLoading(true);

      // ---- BACKEND CALL: send registration data to real backend ----
      // ---- BACKEND REMOVED: setIsSignedUp() and navigate with state ----
      const result = await registerUser({
        name: form.email.split("@")[0],
        email: form.email,
        password: form.password,
      });

      if (result.success) {
        // ---- BACKEND ADDED: show success modal then go to login ----
        setModal({
          show: true,
          type: "success",
          message: "Account created! Please check your email to verify your account.",
        });
      } else {
        // ---- BACKEND ADDED: show error modal with backend message ----
        setModal({
          show: true,
          type: "error",
          message: result.message || "Registration failed. Please try again.",
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

    setForm({
      email: "",
      password: "",
      confirmpassword: "",
      terms: false,
    });
  };

  // ---- BACKEND ADDED: handle modal close ----
  // if success, navigate to login when user clicks OK
  const handleModalClose = () => {
    setModal({ ...modal, show: false });
    if (modal.type === "success") {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col-reverse w-screen md:flex-row h-screen items-center justify-center rounded-t-none">
      <div className="w-full">
        <form
          onSubmit={handleSubmit}
          className="md:w-[507px] w-full flex flex-col mx-auto my-0 md:my-8 px-4 pb-25 md:pb-30.5 pt-4 md:pt-6"
        >
          <div className="flex flex-col gap-3">
            <div className="flex gap-4 items-center">
              <img className="hidden md:block w-6" src={nestpro} onClick={() => navigate("/")} alt="arrow" />
              <img className="hidden md:block" src={logo} alt="" />
            </div>

            <h4
              onClick={() => { if (window.innerWidth < 768) { navigate("/"); } }}
              className="text-[15px] md:text-[32px] font-semibold mb-2.5 tracking-wide cursor-pointer md:cursor-default">
              Create An account
            </h4>
            <span className="hidden md:flex md:flex-row items-start gap-1 font-light text-[13px] mb-6 tracking-wide">
              Already have an account?
              <Link to="/login" className="underline">Log In</Link>
            </span>
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
            value={form.confirmpassword}
            onChange={handleChange}
          />

          {/* checkbox */}
          <div className='flex flex-row gap-1'>
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
            />
            <p className='text-[12px]'>I agree to the terms and conditions</p>
          </div>

          {/* ---- BACKEND ADDED: button shows loading state ---- */}
          <button
            disabled={isLoading}
            className="w-full h-9 md:h-10 bg-[#1A3C34] rounded-lg text-white text-[14px] font-light block my-6 hover:bg-[#A5A8A8] hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>

        </form>
      </div>

      <div className="w-full">
        <img className="hidden md:block" src={desktop} alt="desktop-img" />
        <img className="block md:hidden w-full rounded-b-lg md:rounded-b-none" src={mobile} alt="mobile-img" />
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

export default SignUp;