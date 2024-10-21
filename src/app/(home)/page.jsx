"use client";


import MiniAudioControl from "@/components/MiniAudioControl";
import Hero from "./components/Hero";
import Trending from "./components/Trending";

const Home = () => {

  return (
    <main>
        <Hero />
        <Trending />
        <MiniAudioControl />
    </main>
  );
};

export default Home;
