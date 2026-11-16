import { useState } from "react";
import {
  Plus,
  X,
  SlidersHorizontal,
  Maximize2,
  ChevronDown,
  RefreshCw,
  Paintbrush,
  Copy,
  Play,
  Upload,
  Download,
  Save,
  FolderOpen,
  Share2,
  Terminal,
} from "lucide-react";

function Editor() {
  const [input, setInput] = useState("");

  return (
    <div className="h-screen w-full overflow-hidden bg-[#08090c] p-2 text-white">
      <div className="grid h-full grid-cols-[minmax(0,2fr)_minmax(340px,1.08fr)] gap-2">
        {/* LEFT: CODE EDITOR */}
        <section className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#292a30] bg-[#0d0e12]">
          {/* Tab Bar */}
          <div className="flex h-10 shrink-0 items-center justify-between border-b border-[#292a30] bg-[#141418]">
            <div className="flex h-full items-center gap-1">
              <div className="flex h-full items-center gap-3 rounded-t-xl border border-b-0 border-[#292a30] bg-[#0d0e12] px-4 text-sm">
                <span className="font-medium">Code 1</span>
                <X
                  size={13}
                  className="cursor-pointer text-gray-500 hover:text-white"
                />
              </div>

              <button className="px-2 text-gray-400 transition hover:text-white">
                <Plus size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3 px-4 text-gray-400">
              <SlidersHorizontal
                size={17}
                className="cursor-pointer hover:text-white"
              />
              <Maximize2
                size={15}
                className="cursor-pointer hover:text-white"
              />
            </div>
          </div>

          {/* Editor Toolbar */}
          <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-[#292a30] bg-[#141418] px-5">
            <button className="flex items-center gap-2 text-sm font-medium text-gray-200">
              C++
              <ChevronDown size={16} className="text-gray-400" />
            </button>

            <div className="flex items-center gap-4">
              <RefreshCw
                size={16}
                className="cursor-pointer text-gray-400 hover:text-white"
              />
              <Paintbrush
                size={16}
                className="cursor-pointer text-gray-400 hover:text-white"
              />
              <Copy
                size={16}
                className="cursor-pointer text-gray-400 hover:text-white"
              />

              <button className="flex items-center gap-2 rounded-lg bg-[#3478f6] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500">
                <Play size={15} fill="currentColor" />
                Run
              </button>
            </div>
          </div>

          {/* Code Editor Placeholder */}
          <div className="flex min-h-0 flex-1 overflow-hidden bg-[#0d1016] font-mono text-[15px]">
            <div className="w-[55px] shrink-0 border-r border-[#252830] py-3 text-right text-gray-500">
              {Array.from({ length: 30 }, (_, i) => (
                <div key={i} className="h-[24px] pr-4 leading-6">
                  {i + 1}
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-auto p-3 leading-6">
              <pre className="text-gray-200">
                <code>
                  <span className="text-red-400">#include</span>{" "}
                  <span className="text-sky-300">&lt;iostream&gt;</span>
                  {"\n"}
                  <span className="text-red-400">using namespace</span>{" "}
                  <span className="text-sky-300">std</span>;{"\n\n"}
                  <span className="text-purple-400">int</span> main() {"{"}
                  {"\n"}
                  {"    "}cout <span className="text-red-400">&lt;&lt;</span>{" "}
                  <span className="text-green-300">"Hello, World!"</span>{" "}
                  <span className="text-red-400">&lt;&lt;</span> endl;
                  {"\n"}
                  {"    "}
                  <span className="text-red-400">return</span>{" "}
                  <span className="text-orange-300">0</span>;{"\n"}
                  {"}"}
                </code>
              </pre>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex h-[42px] shrink-0 items-center justify-between border-t border-[#292a30] bg-[#141418] px-5 text-xs text-gray-400">
            <div className="flex items-center gap-5">
              <span>UTF-8</span>
              <span>Spaces: 4</span>
              <span>Ln 7, Col 2</span>
              <span>7 lines</span>
            </div>

            <div className="flex items-center gap-4">
              <Download size={16} className="cursor-pointer hover:text-white" />
              <FolderOpen
                size={17}
                className="cursor-pointer hover:text-white"
              />
              <Save size={16} className="cursor-pointer hover:text-white" />
              <Share2 size={16} className="cursor-pointer hover:text-white" />
            </div>
          </div>
        </section>

        {/* RIGHT: INPUT AND OUTPUT */}
        <section className="grid min-h-0 grid-rows-2 gap-2">
          {/* Input Panel */}
          <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#191a20] bg-[#141418]">
            <div className="flex h-[50px] shrink-0 items-center justify-between border-b border-[#292a30] px-4">
              <h2 className="text-lg font-medium">Input</h2>

              <div className="flex items-center gap-4 text-gray-400">
                <Upload size={16} className="cursor-pointer hover:text-white" />
                <Copy size={16} className="cursor-pointer hover:text-white" />
                <RefreshCw
                  size={16}
                  className="cursor-pointer hover:text-white"
                />
              </div>
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter input..."
              spellCheck={false}
              className="min-h-0 flex-1 resize-none bg-transparent p-6 font-mono text-sm text-gray-200 outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Output Panel */}
          <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#191a20] bg-[#141418]">
            <div className="flex h-[50px] shrink-0 items-center justify-between border-b border-[#292a30] px-4">
              <h2 className="text-lg font-medium">Output</h2>

              <div className="flex items-center gap-4 text-gray-400">
                <Download
                  size={16}
                  className="cursor-pointer hover:text-white"
                />
                <Copy size={16} className="cursor-pointer hover:text-white" />
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-[#292a30] text-gray-500">
                <Terminal size={23} />
              </div>

              <h3 className="text-base font-semibold text-white">
                Ready to Run
              </h3>

              <p className="mt-2 max-w-[260px] text-sm leading-6 text-gray-500">
                Write your code and click Run to see the output here.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Editor;
