import React, { useState } from "react";

// ---- BACKEND: imported submitEnquiry from api service ----
import { submitEnquiry } from "../../services/api";
import Modal from "../Universal/Modal";

type User = {
  name: string;
  email: string;
  message: string;
};

type ErrorType = {
  name: string;
  email: string;
  message: string;
};

// ---- BACKEND ADDED: propertyId prop to link enquiry to property ----
interface AgentFormProps {
  propertyId: string;
}

const AgentForm = ({ propertyId }: AgentFormProps) => {
  const [user, setUser] = useState<User>({ name: "", email: "", message: "" });
  const [error, setError] = useState<ErrorType>({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const inputFieldName = name as keyof User;
    setUser({ ...user, [inputFieldName]: value });
    setError({ ...error, [inputFieldName]: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasError = false;
    const newError: ErrorType = { name: "", email: "", message: "" };

    if (!user.name.trim()) {
      newError.name = "Name is required";
      hasError = true;
    }
    if (!user.email.trim()) {
      newError.email = "Email is required";
      hasError = true;
    } else if (!user.email.includes("@")) {
      newError.email = "Email is invalid";
      hasError = true;
    }
    if (!user.message.trim()) {
      newError.message = "Message is required";
      hasError = true;
    }

    if (hasError) {
      setError(newError);
      return;
    }

    try {
      setIsLoading(true);

      // ---- BACKEND CALL: submit enquiry to backend ----
      // ---- BACKEND REMOVED: console.log("Submitted", user) ----
      const result = await submitEnquiry({
        name: user.name,
        email: user.email,
        message: user.message,
        propertyId,
      });

      if (result.success) {
        setModal({
          show: true,
          type: "success",
          message: "Enquiry submitted! The agent will contact you soon.",
        });
        // ---- clear form on success ----
        setUser({ name: "", email: "", message: "" });
        setError({ name: "", email: "", message: "" });
      } else {
        setModal({
          show: true,
          type: "error",
          message: result.message || "Failed to submit enquiry",
        });
      }
    } catch (error) {
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
    <>
      <div className='font-Manrope lg:w-[387px] w-full border border-[#918F8F] rounded-[10px] p-[20px]'>
        <form onSubmit={handleSubmit} className='flex flex-col bg-white gap-[10px]'>
          <h1 className="font-bold text-[18px] text-[#023337]">Contact Agent</h1>

          <label htmlFor="name" className='text-[#676565] font-bold'>Name</label>
          <input
            type="text"
            placeholder='Enter your name'
            className={`border rounded-[10px] p-[10px] outline-none ${error.name ? "border-red-500" : "border-[#918F8F]"}`}
            id="name"
            name="name"
            value={user.name}
            onChange={handleChange}
          />
          {error.name && <p className="text-red-500 text-[13px]">{error.name}</p>}

          <label htmlFor="email" className='text-[#676565] font-bold'>Email</label>
          <input
            type="email"
            placeholder='Enter your email'
            className={`border rounded-[10px] p-[10px] outline-none ${error.email ? "border-red-500" : "border-[#918F8F]"}`}
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
          {error.email && <p className="text-red-500 text-[13px]">{error.email}</p>}

          <label htmlFor="message" className='text-[#676565] font-bold'>Message</label>
          <textarea
            name="message"
            id="message"
            placeholder='Enter your message'
            rows={4}
            className={`border rounded-[10px] p-[10px] outline-none resize-none ${error.message ? "border-red-500" : "border-[#918F8F]"}`}
            value={user.message}
            onChange={handleChange}>
          </textarea>
          {error.message && <p className="text-red-500 text-[13px]">{error.message}</p>}

          <button
            className='w-full h-[49px] bg-[#1A3C34] rounded-[10px] mt-[12px] text-white disabled:opacity-50'
            type="submit"
            disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      {/* ---- BACKEND ADDED: modal for success and error messages ---- */}
      {modal.show && (
        <Modal
          type={modal.type}
          message={modal.message}
          onClose={() => setModal({ ...modal, show: false })}
        />
      )}
    </>
  );
};

export default AgentForm;