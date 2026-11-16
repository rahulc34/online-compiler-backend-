import { Terminal, GitBranch, ArrowUpRight } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#080b14] px-6">
      <div className="mx-auto max-w-7xl py-12">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          {/* Brand */}
          <div className="max-w-sm">
            <a href="/" className="inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <Terminal size={19} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">Compiler</span>
            </a>

            <p className="mt-4 text-sm leading-6 text-gray-500">
              A simple and powerful online coding environment. Write, run, and
              experiment with code — all in one place.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-12 sm:gap-20">
            <div>
              <h3 className="mb-4 text-sm font-semibold text-white">Explore</h3>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>
                  <a href="#features" className="transition hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#languages" className="transition hover:text-white">
                    Languages
                  </a>
                </li>
                <li>
                  <a href="#about" className="transition hover:text-white">
                    About
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold text-white">Project</h3>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>
                  <a
                    href="/editor"
                    className="inline-flex items-center gap-1 transition hover:text-white"
                  >
                    Open Editor <ArrowUpRight size={13} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 transition hover:text-white"
                  >
                    <GitBranch size={15} /> GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-gray-600 sm:flex-row">
          <p>© {new Date().getFullYear()} Compiler. All rights reserved.</p>
          <p>Built for developers, by developers.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
