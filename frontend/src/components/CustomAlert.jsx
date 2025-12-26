import { useEffect, useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";

let alertHandler;

export const showCustomAlert = (message) => {
  if (alertHandler) {
    alertHandler(message);
  }
};

export default function CustomAlert() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    alertHandler = (message) => {
      setMessage(message);
      setVisible(true);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#202124] border border-[#2a2a2a] rounded-xl shadow-2xl w-full max-w-sm p-6 animate-fadeIn">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <FaExclamationCircle className="text-red-600" size={42} />
        </div>

        {/* Message */}
        <p className="text-center text-white text-sm mb-6">{message}</p>

        {/* Button */}
        <button
          onClick={() => setVisible(false)}
          className="w-full bg-red-600 hover:bg-red-700 transition text-white py-2 rounded font-medium"
        >
          OK
        </button>
      </div>
    </div>
  );
}
