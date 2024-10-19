import Image from "next/image";
import hero from "@/assets/img/hero.png";
import Header from "./components/Header";

export default function Home() {
  return (
    <main>
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
                <div className="bg-[#EE10B0] md:px-7 md:py-3 px-3 py-1 md:text-base text-sm rounded shadow shadow-[#ee10af9d] cursor-pointer hover:translate-y-1 active:translate-y-0 transition duration-150">
                Play Now
                </div>
            </div>
            </div>
            <Image alt="" src={hero} className="w-full z-[1] rounded-md h-[50vw]" />
        </section>
        <section className="min-h-screen text-white py-20 px-10">
            <h1 className="font-semibold text-5xl">Trending <span className="text-[#EE10B0]">Songs</span></h1>
            
        </section>
    </main>
  );
}
