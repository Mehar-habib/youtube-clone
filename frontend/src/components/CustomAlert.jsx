import { useEffect, useState } from "react";
import { FaExclamationCircle, FaCheckCircle } from "react-icons/fa";

let alertHandler;

// type can be "error" or "success"
export const showCustomAlert = (message, type = "error") => {
  if (alertHandler) {
    alertHandler(message, type);
  }
};

export default function CustomAlert() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState("error");

  useEffect(() => {
    alertHandler = (msg, alertType = "error") => {
      setMessage(msg);
      setType(alertType);
      setVisible(true);
    };
  }, []);

  if (!visible) return null;

  const isError = type === "error";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#202124] border border-[#2a2a2a] rounded-xl shadow-2xl w-full max-w-sm p-6 animate-fadeIn">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          {isError ? (
            <FaExclamationCircle className="text-red-600" size={42} />
          ) : (
            <FaCheckCircle className="text-green-500" size={42} />
          )}
        </div>

        {/* Message */}
        <p className="text-center text-white text-sm mb-6">{message}</p>

        {/* Button */}
        <button
          onClick={() => setVisible(false)}
          className={`w-full ${
            isError
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          } transition text-white py-2 rounded font-medium`}
        >
          OK
        </button>
      </div>
    </div>
  );
}
