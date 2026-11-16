import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Zap,
  CheckCircle2,
  Sun,
  Copy,
  Maximize2,
  ChevronDown,
  Code2,
} from "lucide-react";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden px-6 md:px-10 pt-20 pb-24">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* LEFT CONTENT */}
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-sm mb-7">
            <Zap size={15} />
            Your code. Your playground.
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] text-white">
            Write Code.
            <br />
            Run It.
            <span className="block mt-2 bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Build Something.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-7 text-gray-400 text-base md:text-lg leading-relaxed max-w-xl">
            A modern online compiler and IDE for developers. Code, compile and
            execute your programs instantly right from your browser.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mt-9">
            <button
              onClick={() => navigate("/editor")}
              className="group flex items-center gap-3 px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 transition-all duration-300"
            >
              Start Coding
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

            <button
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="flex items-center gap-3 px-7 py-3.5 rounded-full border border-white/15 hover:bg-white/5 text-white font-medium transition"
            >
              <Play size={17} />
              Watch Demo
            </button>
          </div>

          {/* Developer Trust */}
          <div className="flex items-center gap-4 mt-10">
            <div className="flex -space-x-3">
              {["R", "A", "S", "D"].map((letter, index) => (
                <div
                  key={index}
                  className="w-9 h-9 rounded-full border-2 border-[#080b14] bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-xs font-bold text-white"
                >
                  {letter}
                </div>
              ))}
            </div>

            <div>
              <p className="text-sm text-gray-300">Built for developers</p>
              <p className="text-xs text-gray-500 mt-0.5">
                A better place to write and run code
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: EDITOR PREVIEW */}
        <div className="relative">
          {/* Glow behind editor */}
          <div className="absolute inset-0 bg-blue-500/10 blur-[80px] rounded-full" />

          <div className="relative rounded-2xl border border-white/10 bg-[#11151F]/95 shadow-2xl shadow-blue-950/40 overflow-hidden">
            {/* Editor Header */}
            <div className="h-14 px-5 flex items-center justify-between border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
              </div>

              <div className="flex items-center gap-4 text-gray-400">
                <Sun size={16} />
                <Copy size={16} />
                <Maximize2 size={16} />
              </div>
            </div>

            {/* Toolbar */}
            <div className="h-12 px-5 flex items-center justify-between border-b border-white/10">
              <button className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 px-3 py-1.5 rounded-md">
                C++
                <ChevronDown size={14} />
              </button>

              <button
                onClick={() => navigate("/editor")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                <Play size={14} fill="currentColor" />
                Run
              </button>
            </div>

            {/* Editor Body */}
            <div className="grid grid-cols-1 sm:grid-cols-[1.2fr_0.8fr] min-h-[310px]">
              {/* Code Area */}
              <div className="p-5 border-b sm:border-b-0 sm:border-r border-white/10 font-mono text-xs sm:text-sm leading-7 overflow-hidden">
                <div className="flex">
                  <div className="text-gray-600 pr-5 select-none text-right">
                    1<br />2<br />3<br />4<br />5<br />6<br />7
                  </div>

                  <div className="whitespace-nowrap">
                    <p>
                      <span className="text-red-400">#include</span>{" "}
                      <span className="text-green-400">&lt;iostream&gt;</span>
                    </p>

                    <p>
                      <span className="text-red-400">using namespace</span>{" "}
                      <span className="text-yellow-300">std</span>;
                    </p>

                    <p>&nbsp;</p>

                    <p>
                      <span className="text-purple-400">int</span>{" "}
                      <span className="text-blue-300">main</span>() {"{"}
                    </p>

                    <p className="pl-5">
                      <span className="text-blue-300">cout</span>{" "}
                      <span className="text-gray-300">&lt;&lt;</span>{" "}
                      <span className="text-green-400">"Hello, World!"</span>;
                    </p>

                    <p className="pl-5">
                      <span className="text-red-400">return</span>{" "}
                      <span className="text-orange-300">0</span>;
                    </p>

                    <p>{"}"}</p>
                  </div>
                </div>
              </div>

              {/* Input / Output */}
              <div className="p-3 flex flex-col gap-3">
                {/* Input */}
                <div className="flex-1 rounded-xl border border-white/10 bg-[#0B0F18] overflow-hidden">
                  <div className="flex items-center gap-5 px-4 h-10 border-b border-white/10">
                    <span className="text-sm text-blue-400 font-medium border-b-2 border-blue-500 h-full flex items-center">
                      Input
                    </span>

                    <span className="text-sm text-gray-500">Output</span>
                  </div>

                  <div className="p-3 text-xs text-gray-500">
                    Enter input...
                  </div>
                </div>

                {/* Output */}
                <div className="flex-1 rounded-xl border border-blue-500/50 bg-[#0B0F18] p-4">
                  <div className="flex items-center gap-2 text-green-400 mb-3">
                    <CheckCircle2 size={20} />
                    <span className="text-xs font-medium">Ready to run</span>
                  </div>

                  <p className="text-xs text-gray-500">
                    Output will appear here...
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating label */}
          <div className="absolute -bottom-5 -left-5 hidden sm:flex items-center gap-3 bg-[#151B29] border border-white/10 shadow-xl rounded-xl px-4 py-3">
            <div className="w-9 h-9 bg-green-500/10 rounded-lg flex items-center justify-center text-green-400">
              <Code2 size={20} />
            </div>

            <div>
              <p className="text-xs font-semibold text-white">C++ Compiler</p>
              <p className="text-[11px] text-gray-500">Ready to execute</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
