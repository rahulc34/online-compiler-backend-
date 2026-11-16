import { Code2, Zap, Keyboard, Blocks, ArrowUpRight } from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Powerful Editor",
    description:
      "Write code with a modern editor experience featuring syntax highlighting and a clean interface.",
    color: "blue",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/15",
    hoverBorder: "group-hover:border-blue-500/40",
  },
  {
    icon: Zap,
    title: "Instant Execution",
    description:
      "Compile and run your programs in seconds. Get results without leaving your browser.",
    color: "purple",
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/15",
    hoverBorder: "group-hover:border-purple-500/40",
  },
  {
    icon: Keyboard,
    title: "Custom Input",
    description:
      "Provide custom input to your programs and test different scenarios with ease.",
    color: "green",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/15",
    hoverBorder: "group-hover:border-emerald-500/40",
  },
  {
    icon: Blocks,
    title: "Multiple Languages",
    description:
      "Choose your preferred programming language and start building your next idea.",
    color: "orange",
    iconColor: "text-orange-400",
    iconBg: "bg-orange-500/15",
    hoverBorder: "group-hover:border-orange-500/40",
  },
];

function Features() {
  return (
    <section
      id="features"
      className="relative px-6 md:px-10 py-24 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-600/[0.04] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-500/50" />

            <span className="text-xs font-semibold tracking-[0.25em] text-blue-400 uppercase">
              Features
            </span>

            <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-500/50" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              code
            </span>
          </h2>

          <p className="text-gray-400 mt-5 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            A simple yet powerful environment designed to make coding,
            compiling, and experimenting easier.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111521]/80 p-7 transition-all duration-300 hover:-translate-y-2 ${feature.hoverBorder}`}
              >
                {/* Hover background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl ${feature.iconBg} flex items-center justify-center ${feature.iconColor} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon size={27} strokeWidth={1.8} />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white mt-7 flex items-center justify-between">
                    {feature.title}

                    <ArrowUpRight
                      size={17}
                      className="text-gray-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                    />
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-400 mt-3 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;
