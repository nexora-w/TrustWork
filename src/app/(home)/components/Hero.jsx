import Image from "next/image";
import Header from "./Header";
import hero from "@/assets/img/hero.png";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="max-h-screen mx-auto relative shadow-lg">
      <Header />
      <div className="text-white xl:w-1/3 lg:w-1/2 w-4/5 mx-auto z-[2] absolute top-2/3 lg:left-20 max-lg:left-1/2 -translate-y-1/2 max-lg:-translate-x-1/2 ">
        <h1 className="text-5xl max-md:text-xl w-full leading-relaxed md:mb-10 sm:mb-3 mb-1">
          All the
          <strong className="text-[#EE10B0] font-semibold">
            &nbsp;Best Songs&nbsp;
          </strong>
          in One Place
        </h1>
        <p className="text-md max-md:text-sm max-sm:text-xs leading-normal text-justify">
          Welcome to the future of decentralized music streaming! MusicBox
          combines the power of PiNetwork's cryptocurrency ecosystem with
          Audius' decentralized music streaming platform.
        </p>

        <div className="flex items-center justify-center md:my-10 my-2">
          <motion.button
            className="bg-[#EE10B0] md:px-7 md:py-3 px-3 py-1 md:text-base text-sm rounded shadow shadow-[#ee10af9d]"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Play Now
          </motion.button>
        </div>
      </div>
      <Image alt="" src={hero} className="w-full z-[1] rounded-md h-[50vw]" />
    </section>
  );
};

export default Hero;
