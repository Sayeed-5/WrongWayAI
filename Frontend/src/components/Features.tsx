import { motion } from "framer-motion";

const featuresData = [
  {
    title: "Live Monitoring",
    description: "Real-time video feeds with AI-powered violation detection.",
    image: "/traffic img 1.png",
  },
  {
    title: "Wrong-Way Detection",
    description: "Instant alerts when vehicles move against traffic flow.",
    image: "/ai-analytics.png",
  },
  {
    title: "Number Plate Recognition",
    description: "ANPR extracts license plates for violation tracking.",
    image: "/number-plate.png",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 2xl:py-32">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          className="text-center text-2xl md:text-3xl font-semibold text-gray-300 mb-12"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 250, damping: 70 }}
        >
          AI Traffic Monitoring Features
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuresData.map((item, i) => (
            <motion.div
              key={i}
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 250, damping: 70, delay: 0.1 + i * 0.1 }}
              className="relative rounded-2xl overflow-hidden group h-80 cursor-pointer lg:hover:scale-105 lg:hover:-translate-y-2 transition-all duration-500"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover object-center lg:group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/60 lg:group-hover:bg-black/70 transition-all duration-500" />
              <div className="relative z-10 h-full flex flex-col items-center justify-end pb-12 text-center px-6">
                <h3 className="text-xl md:text-2xl font-bold text-white transition-all duration-300">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm md:text-base text-gray-300 opacity-100 lg:opacity-0 lg:translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-500">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
