import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const TEXT = "UrbanVoice";

const IntroLoader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isLoading ? 1 : 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      style={{ pointerEvents: isLoading ? "auto" : "none" }}
      className="fixed inset-0 z-[999] bg-neutral-950 flex items-center justify-center overflow-hidden"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-end gap-1 sm:gap-2 px-4">
          {TEXT.split("").map((letter, i) => {
            const dropDelay = i * 0.12;
            const dropDuration = 0.4;
            const impactTime = dropDelay + dropDuration;
            return (
              <div key={i} className="relative flex flex-col items-center">
                {[...Array(4)].map((_, p) => {
                  const angle = (p / 4) * Math.PI + Math.PI * 0.15;
                  const dx = Math.cos(angle) * 18 * (p % 2 === 0 ? 1 : -1);
                  return (
                    <motion.span
                      key={p}
                      initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                      animate={{
                        opacity: [0, 0.8, 0],
                        x: [0, dx],
                        y: [0, -8 - p * 2],
                        scale: [0.5, 1, 0.3],
                      }}
                      transition={{
                        duration: 0.5,
                        delay: impactTime,
                        ease: "easeOut",
                      }}
                      className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-neutral-400"
                    />
                  );
                })}
                <motion.span
                  initial={{ y: -140, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: dropDuration,
                    delay: dropDelay,
                    ease: "easeIn",
                  }}
                  className="text-3xl sm:text-5xl md:text-6xl font-bold text-neutral-300"
                  style={{ textShadow: "0 0 12px rgba(212,212,212,0.5)" }}
                >
                  {letter}
                </motion.span>
                <motion.span
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: [0, 1.4, 1], opacity: [0, 0.5, 0.2] }}
                  transition={{
                    duration: 0.4,
                    delay: impactTime,
                    ease: "easeOut",
                  }}
                  className="block w-6 h-1 bg-neutral-400 rounded-full blur-[2px] mt-1"
                />
              </div>
            );
          })}
        </div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: TEXT.length * 0.12 + 0.4 }}
          className="text-neutral-400 text-xs sm:text-sm tracking-[0.2em] uppercase"
        >
          Your voice, your city, your change
        </motion.p>
      </div>
    </motion.div>
  );
};

export default IntroLoader;