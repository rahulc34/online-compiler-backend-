import { ArrowRight, Terminal, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CTA() {
  const navigate = useNavigate();

  return (
    <section id="about" className="px-6 py-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-[#151d38] via-[#17152f] to-[#111521] px-6 py-16 text-center sm:px-12">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-blue-600/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-purple-600/20 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-2xl">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
            <Terminal size={27} />
          </div>

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/10 px-4 py-2 text-sm text-purple-300">
            <Sparkles size={15} />
            Your next idea starts here
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Ready to start
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              coding?
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-gray-400 sm:text-lg">
            Open your browser, write your code, and bring your ideas to life. No
            complicated setup. Just you and your code.
          </p>

          <button
            onClick={() => navigate("/editor")}
            className="mt-9 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-7 py-4 font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:-translate-y-1 hover:shadow-blue-900/50"
          >
            Launch Compiler
            <ArrowRight size={18} />
          </button>

          <p className="mt-5 text-sm text-gray-500">
            Free to use · No installation required
          </p>
        </div>
      </div>
    </section>
  );
}

export default CTA;
