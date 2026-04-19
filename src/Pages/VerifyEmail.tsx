import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

// ---- BACKEND: calls verify email endpoint when page loads ----
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  // ---- FIX: useRef prevents double call in React StrictMode ----
  const hasVerified = useRef(false);

  useEffect(() => {
    // ---- FIX: if already called once, don't call again ----
    if (hasVerified.current) return;
    hasVerified.current = true;

    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    // ---- BACKEND CALL: verify email with token from URL ----
    const verifyEmail = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/verify-email/${token}`);
        const data = await res.json();

        if (data.success) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md flex flex-col items-center gap-6">

        {/* Loading */}
        {status === "loading" && (
          <>
            <div className="w-16 h-16 rounded-full border-4 border-[#1A3C34] border-t-transparent animate-spin" />
            <p className="text-[#444545] text-[15px] font-medium">Verifying your email...</p>
          </>
        )}

        {/* Success */}
        {status === "success" && (
          <>
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-[#023337] font-bold text-[22px] text-center">Email Verified!</h2>
            <p className="text-[#444545] text-[14px] text-center">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-[#1A3C34] text-white py-3 rounded-lg font-semibold hover:bg-[#023337]">
              Go to Login
            </button>
          </>
        )}

        {/* Error */}
        {status === "error" && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-[#023337] font-bold text-[22px] text-center">Verification Failed</h2>
            <p className="text-[#444545] text-[14px] text-center">{message}</p>
            <button
              onClick={() => navigate("/signup")}
              className="w-full bg-[#1A3C34] text-white py-3 rounded-lg font-semibold hover:bg-[#023337]">
              Back to Sign Up
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;