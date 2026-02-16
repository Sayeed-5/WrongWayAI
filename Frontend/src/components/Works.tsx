import { motion } from "framer-motion";
import { Video, Cpu, ScanLine, FileCheck } from "lucide-react";

export default function Works() {
  const steps = [
    {
      icon: <Video size={32} />,
      title: "Upload Video",
      description: "Traffic CCTV or recorded footage is uploaded into the system.",
    },
    {
      icon: <Cpu size={32} />,
      title: "AI Processing",
      description: "AI model analyzes vehicle movement and direction patterns.",
    },
    {
      icon: <ScanLine size={32} />,
      title: "Violation Detection",
      description:
        "System detects wrong-way vehicles and extracts number plate data.",
      highlight: true,
    },
    {
      icon: <FileCheck size={32} />,
      title: "Report Generated",
      description: "Detailed violation report with timestamps and evidence frames is created.",
      success: true,
    },
  ];

  return (
    <section id="works" className="relative py-28 bg-gradient-to-b overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full top-[-200px] left-[-150px] animate-pulse" />
        <div className="absolute w-[400px] h-[400px] bg-green-500/10 blur-[120px] rounded-full bottom-[-150px] right-[-150px] animate-pulse" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4">

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-2xl md:text-3xl font-semibold text-gray-200 mb-20"
        >
          How The System Works
        </motion.h2>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-16">

          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center max-w-xs">

              {/* Circle */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`
                  relative flex items-center justify-center
                  w-24 h-24 rounded-full
                  bg-white/5 backdrop-blur-xl
                  border border-white/10
                  shadow-xl
                  transition-all duration-500
                  ${step.highlight ? "shadow-cyan-500/50" : ""}
                  ${step.success ? "bg-green-500/20 shadow-green-500/50" : ""}
                `}
              >
                <div className={`${step.success ? "text-green-400" : "text-cyan-400"}`}>
                  {step.icon}
                </div>

                {/* Pulse ring */}
                <span className="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping opacity-20" />
              </motion.div>

              {/* Title */}
              <h3
                className={`mt-6 text-lg font-semibold ${
                  step.success ? "text-green-400" : "text-white"
                }`}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                {step.description}
              </p>

              {/* Arrows remain same */}
              {index !== steps.length - 1 && (
                <>
                  <div className="hidden md:flex absolute top-12 left-full items-center">
                    <div className="w-24 h-[2px] bg-gradient-to-r from-cyan-400/60 to-transparent relative overflow-hidden">
                      <motion.div
                        initial={{ x: -100 }}
                        animate={{ x: 100 }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          ease: "linear",
                        }}
                        className="absolute w-16 h-[2px] bg-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="md:hidden flex justify-center mt-10">
                    <div className="h-16 w-[2px] bg-gradient-to-b from-cyan-400/60 to-transparent relative overflow-hidden">
                      <motion.div
                        initial={{ y: -50 }}
                        animate={{ y: 50 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.8,
                          ease: "linear",
                        }}
                        className="absolute h-10 w-[2px] bg-cyan-400"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-20 text-center text-gray-400 max-w-3xl mx-auto leading-relaxed"
        >
          The system leverages advanced AI and computer vision models to monitor traffic footage, detect wrong-way violations in real time, extract number plates, and generate structured reports. This ensures faster enforcement, improved road safety, and reduced manual monitoring efforts.
        </motion.p>
      </div>
    </section>
  );
}
