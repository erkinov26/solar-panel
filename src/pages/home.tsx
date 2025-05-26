import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Agar Next.js bo'lsa, rasmni public papkadan shunday chaqiramiz:
const backgrounds = [
  "/solar-black.png",
  "/solar-green.svg"
];

const rotatingWords = [
  { text: "RENEWABLE", color: "text-green-400" },
  { text: "ENERGY", color: "text-yellow-400" },
  { text: "SOLUTIONS", color: "text-blue-400" },
];

const letterVariants = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 10 },
};

export function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedLettersCount, setDisplayedLettersCount] = useState(0);
  const word = rotatingWords[currentWordIndex].text;

  // Fonni har 4 soniyada almashtirish
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgrounds.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Typing effekt logikasi
  useEffect(() => {
    setDisplayedLettersCount(0);
    const typingInterval = setInterval(() => {
      setDisplayedLettersCount((count) => {
        if (count === word.length) {
          clearInterval(typingInterval);
          setTimeout(() => {
            setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
          }, 1500);
          return count;
        }
        return count + 1;
      });
    }, 150);
    return () => clearInterval(typingInterval);
  }, [currentWordIndex, word]);

  return (
    <section className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Fon qatlamlari */}
      {backgrounds.map((bg, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === currentIndex ? "opacity-100 z-0" : "opacity-0 z-0"
          }`}
          style={{
            backgroundImage:
              bg === "/solar-green.svg"
                ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,50,0.6)), url(${bg})`
                : `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      ))}

      {/* Kontent markazda */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center max-w-[90vw] mx-auto">
        <h1 className="flex flex-wrap justify-center gap-2 sm:gap-6 text-[8vw] sm:text-[4vw] font-bold tracking-wide leading-tight sm:leading-[4.5vw] text-white">
          {/* Statik so'zlar */}
          <span>RENEWABLE ENERGY</span>

          {/* Almashuvchi so'zlar */}
          <span className={`ml-2 flex ${rotatingWords[currentWordIndex].color} whitespace-nowrap`}>
            {word
              .slice(0, displayedLettersCount)
              .split("")
              .map((letter, i) => (
                <motion.span
                  key={i}
                  variants={letterVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            {/* Kursor */}
            <motion.span
              className="ml-1 text-white"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              |
            </motion.span>
          </span>
        </h1>

        <p className="text-[4.5vw] sm:text-[2vw] text-gray-200 mt-6">
          Empowering Tomorrow With Solar
        </p>

        <p className="text-[3.5vw] sm:text-[1.2vw] text-gray-300 leading-snug sm:leading-[1.8vw] max-w-[600px] mx-auto mt-4">
          Embrace the power of the sun with our cutting-edge solar solutions. Designed for efficiency and sustainability, our systems promise a greener tomorrow. Power your home or business with renewable energy, reducing costs and supporting a healthier planet.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mt-8">
          <a
            href="#"
            className="px-6 py-3 sm:px-8 sm:py-4 border border-white rounded-full text-white text-[4vw] sm:text-[1.1vw] hover:bg-white hover:text-black transition duration-300"
          >
            Our Solar Solutions
          </a>
          <a
            href="#"
            className="px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 rounded-full text-white text-[4vw] sm:text-[1.1vw] hover:bg-blue-500 transition duration-300"
          >
            Speak To A Pro!
          </a>
        </div>
      </div>
    </section>
  );
}
