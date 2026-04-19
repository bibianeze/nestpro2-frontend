import { type FC } from "react";

interface ModalProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

const Modal: FC<ModalProps> = ({ type, message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm flex flex-col items-center gap-4">
        
        {/* Icon */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center
          ${type === "success" ? "bg-green-100" : "bg-red-100"}`}>
          {type === "success" ? (
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        {/* Message */}
        <p className="text-center text-[15px] text-[#444545] font-medium">
          {message}
        </p>

        {/* Button */}
        <button
          onClick={onClose}
          className={`w-full py-3 rounded-lg text-white font-semibold text-[15px]
            ${type === "success" ? "bg-[#1A3C34] hover:bg-[#023337]" : "bg-red-500 hover:bg-red-600"}`}>
          {type === "success" ? "OK" : "Try Again"}
        </button>

      </div>
    </div>
  );
};

export default Modal;