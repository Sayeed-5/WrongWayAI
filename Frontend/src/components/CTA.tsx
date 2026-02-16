import { ArrowRightIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative container mx-auto max-w-4xl">
        <div className="relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-12 md:p-16 text-center shadow-xl hover:shadow-cyan-500/20 transition-all duration-500">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6 text-cyan-400 text-5xl"
          >
            🚦
          </motion.div>
          <motion.h2
            className="text-2xl sm:text-4xl font-semibold mb-6 text-white"
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            Ready to Make Roads Safer?
          </motion.h2>
          <motion.p
            className="text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Deploy AI-powered wrong-way detection and number plate recognition.
            Get started with the WrongWayAI dashboard today.
          </motion.p>
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <a href="/login" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-medium transition-all duration-300 shadow-lg hover:shadow-cyan-500/40">
              Get Started <ArrowRightIcon size={18} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
