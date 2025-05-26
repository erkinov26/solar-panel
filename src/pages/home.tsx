import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { about } from "../mock";
import { Card } from "../components/ui/card-hover-effect";
import { CardSpotlight } from "../components/ui/card-spotlight";

const backgrounds = ["/solar-black.png", "/solar-green.svg"];

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

const navItems = [
  { name: "Home", href: "#" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Contact", href: "#contact" },
];

export function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedLettersCount, setDisplayedLettersCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const word = rotatingWords[currentWordIndex].text;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgrounds.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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

  // Scroll kuzatuvchi
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="overflow-x-hidden">
        <section className="relative h-screen w-screen overflow-hidden bg-black">
          {backgrounds.map((bg, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-1000 ${i === currentIndex ? "opacity-100 z-0" : "opacity-0 z-0"}`}
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

          <nav
            className={`fixed top-0 left-0 w-full z-30 transition-all duration-300 ${scrolled ? "bg-black/70 shadow-lg backdrop-blur-md" : "bg-transparent"
              }`}
          >
            <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between h-16">
              <a
                href="#"
                className="text-white font-extrabold text-xl md:text-2xl tracking-widest select-none"
              >
                SOLAR+
              </a>
              <ul className="hidden md:flex space-x-10 text-white font-semibold text-base md:text-lg">
                {navItems.map((item) => (
                  <li key={item.name} className="relative group cursor-pointer select-none">
                    <a
                      href={item.href}
                      className="hover:text-green-400 transition-colors duration-300"
                    >
                      {item.name}
                    </a>
                    <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-400 transition-all group-hover:w-full"></span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none"
                aria-label="Toggle menu"
              >
                <span
                  className={`block w-7 h-0.5 bg-white rounded transform transition duration-300 ease-in-out ${mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                    }`}
                />
                <span
                  className={`block w-7 h-0.5 bg-white rounded transition duration-300 ease-in-out ${mobileMenuOpen ? "opacity-0" : ""
                    }`}
                />
                <span
                  className={`block w-7 h-0.5 bg-white rounded transform transition duration-300 ease-in-out ${mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                    }`}
                />
              </button>
            </div>
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col px-6 pb-6 space-y-4 bg-black bg-opacity-90 md:hidden"
                >
                  {navItems.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-white text-base font-semibold hover:text-green-400 transition-colors duration-300 select-none"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </nav>

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center max-w-[90vw] mx-auto">
            <h1 className="flex flex-wrap justify-center font-bold sm:w-auto w-[85%] tracking-wide leading-tight text-white select-none sm:text-[4vw] text-[6vw] ">
              <span>RENEWABLE ENERGY</span>
              <span
                className={`ml-2 flex ${rotatingWords[currentWordIndex].color} whitespace-nowrap`}
              >
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
                <motion.span
                  className="ml-1 text-white"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  |
                </motion.span>
              </span>
            </h1>

            <p className="sm:text-[2vw] text-[4vw] text-gray-200 mt-4">
              Empowering Tomorrow With Solar
            </p>

            <p className="sm:text-[1.2vw] text-[3vw] text-gray-300 sm:leading-[1.8vw] leading-[4vw] max-w-[90vw] mx-auto mt-2">
              Embrace the power of the sun with our cutting-edge solar solutions. Designed for
              efficiency and sustainability, our systems promise a greener tomorrow. Power your home
              or business with renewable energy, reducing costs and supporting a healthier planet.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 px-4">
              <a
                href="#"
                className="w-full sm:w-auto px-6 py-3 border border-white rounded-full text-white text-base sm:text-[1.1vw] text-center hover:bg-white hover:text-black transition duration-300"
              >
                Our Solar Solutions
              </a>
              <a
                href="#"
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 rounded-full text-white text-base sm:text-[1.1vw] text-center hover:bg-blue-500 transition duration-300"
              >
                Speak To A Pro!
              </a>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="bg-gray-900 py-20 min-h-[100vh] px-6 flex flex-col justify-center items-center"
        >
          <div className="max-w-7xl text-center mb-12">
            <h2 className=" font-bold sm:w-auto w-full tracking-wide leading-tight text-white select-none sm:text-[4vw] text-[6vw]">
              About Our Solar Solutions
            </h2>
            <p className="sm:text-[2vw] text-[4vw] text-gray-400 mt-4">
              Discover how our solar technology is changing the future.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 max-w-7xl w-full justify-center items-stretch">
            {about.map(({ color, title, svgPath, text }, idx) => (
              // <Button key={idx}
              //   className="shadow-lg rounded-xl p-6 text-center flex-1 flex w-full flex-col bg-gray-800"
              // >
                <CardSpotlight
                  key={idx}
                  className="shadow-lg rounded-xl p-6 text-center flex-1 flex w-full flex-col bg-gray-800"
                >
                  <Card className="bg-transparent flex flex-col h-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-16 h-16 mx-auto mb-4 ${color}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={svgPath} />
                    </svg>
                    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                    <p className="text-gray-300 text-sm">{text}</p>
                  </Card>
                </CardSpotlight>
              // </Button>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
