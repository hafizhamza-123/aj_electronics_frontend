import { useEffect, useState } from "react";
import { FiChevronUp } from "react-icons/fi";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] transition-all duration-500 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="group relative bg-gradient-to-br from-orange-500 to-orange-600 text-white p-3 sm:p-4 rounded-full shadow-md sm:shadow-lg
          hover:from-orange-600 hover:to-orange-700 transition-all duration-300 active:scale-95 focus:outline-none focus:ring-4 focus:ring-orange-300"
      >
        {/* Glow animation ring */}
        <span className="absolute inset-0 rounded-full bg-orange-500 opacity-30 blur-sm group-hover:opacity-50 transition-opacity duration-300"></span>

        {/* Up Arrow */}
        <FiChevronUp className="w-5 h-5 sm:w-6 sm:h-6 relative z-10 animate-bounce-slow" />
      </button>

      {/* Smooth bounce animation */}
      <style>{`
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .animate-bounce-slow {
          animation: bounceSlow 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
