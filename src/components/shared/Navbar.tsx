import { ArrowRight, Terminal } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#080b14]/85 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto h-[72px] px-6 md:px-10 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition">
            <Terminal size={23} className="text-white" />
          </div>

          <span className="text-xl font-bold tracking-tight text-white">
            Compiler
          </span>
        </button>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          <a
            href="#features"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Features
          </a>

          <a
            href="#languages"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Languages
          </a>

          <a
            href="#about"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            About
          </a>
        </div>

        {/* Open Editor Button */}
        <button
          onClick={() => navigate("/editor")}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-full border border-blue-500/60 bg-blue-500/[0.08] text-white text-sm font-medium hover:bg-blue-600 hover:border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.12)] hover:shadow-[0_0_25px_rgba(37,99,235,0.3)] transition-all duration-300"
        >
          Open Editor
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
