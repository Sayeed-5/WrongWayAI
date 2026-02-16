

import { ChevronDownIcon } from "lucide-react";
import Title from "./Title";
import { faqData } from "../assets/dummy-data";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
>
      <div className="max-w-3xl mx-auto px-4">

        <Title
          title="FAQ"
          heading="Frequently asked questions"
          description="Everything you need to know about WrongWayAI traffic monitoring system."
        />

        <div className="space-y-5 mt-12">
          {faqData.map((faq, i) => {
            const isOpen = activeIndex === i;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                  delay: i * 0.1,
                }}
                className={`
                  relative rounded-2xl
                  bg-white/5 backdrop-blur-xl
                  border border-white/10
                  shadow-lg
                  hover:shadow-cyan-500/20
                  transition-all duration-300
                `}
              >
                {/* Question Header */}
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <h4 className="text-base md:text-lg font-medium text-white">
                    {faq.question}
                  </h4>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`${
                      isOpen ? "text-cyan-400" : "text-gray-400"
                    }`}
                  >
                    <ChevronDownIcon className="w-5 h-5" />
                  </motion.div>
                </button>

                {/* Animated Answer */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-sm text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Subtle Glow Line */}
                {isOpen && (
                  <motion.div
                    layoutId="faq-glow"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400/60 rounded-full"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
