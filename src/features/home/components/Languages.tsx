import { ArrowUpRight, Code2 } from "lucide-react";

const languages = [
  {
    name: "C++",
    extension: ".cpp",
    description: "High-performance programming",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    color: "group-hover:border-blue-500/40",
    glow: "group-hover:shadow-blue-500/10",
  },
  {
    name: "C",
    extension: ".c",
    description: "Low-level system programming",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
    color: "group-hover:border-blue-400/40",
    glow: "group-hover:shadow-blue-400/10",
  },
  {
    name: "Java",
    extension: ".java",
    description: "Object-oriented programming",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    color: "group-hover:border-orange-500/40",
    glow: "group-hover:shadow-orange-500/10",
  },
  {
    name: "Python",
    extension: ".py",
    description: "Simple and versatile programming",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    color: "group-hover:border-yellow-500/40",
    glow: "group-hover:shadow-yellow-500/10",
  },
  {
    name: "JavaScript",
    extension: ".js",
    description: "Dynamic web programming",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    color: "group-hover:border-yellow-400/40",
    glow: "group-hover:shadow-yellow-400/10",
  },
];

function Languages() {
  return (
    <section
      id="languages"
      className="relative px-6 md:px-10 py-24 border-t border-white/[0.06] overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-purple-600/[0.06] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
            <Code2 size={15} />
            Supported Languages
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Your language.
            <span className="block mt-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Your way of coding.
            </span>
          </h2>

          <p className="text-gray-400 mt-5 max-w-xl mx-auto leading-relaxed">
            Pick your favorite programming language and start turning your ideas
            into working code.
          </p>
        </div>

        {/* Language Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {languages.map((language) => (
            <div
              key={language.name}
              className={`group relative bg-[#111521] border border-white/[0.08] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${language.color} ${language.glow}`}
            >
              {/* Extension */}
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-gray-500 bg-white/[0.05] px-2.5 py-1 rounded-md">
                  {language.extension}
                </span>

                <ArrowUpRight
                  size={17}
                  className="text-gray-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                />
              </div>

              {/* Language Logo */}
              <div className="h-20 flex items-center justify-center mt-5 mb-5">
                <img
                  src={language.logo}
                  alt={`${language.name} logo`}
                  className="w-14 h-14 object-contain transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* Language Name */}
              <h3 className="text-lg font-semibold text-white text-center">
                {language.name}
              </h3>

              {/* Description */}
              <p className="text-xs text-gray-500 text-center mt-2 leading-relaxed">
                {language.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <p className="text-center text-sm text-gray-500 mt-10">
          More programming languages and features coming soon.
        </p>
      </div>
    </section>
  );
}

export default Languages;
