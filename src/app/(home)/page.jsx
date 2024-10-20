"use client";

import Image from "next/image";
import hero from "@/assets/img/hero.png";
import Header from "./components/Header";
import { useState, useEffect } from "react";
import { genreList } from "@/utils/genreList";
import { useDispatch } from "react-redux";
import { setTracks } from "@/store/slices/tracks";

const Home = () => {
  const dispatch = useDispatch();
  const [playlist, setPlaylist] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [piEarned, setPiEarned] = useState(0);
  const [totalListeningTime, setTotalListeningTime] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [genres, setGenres] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const AUDIUS_API_HOST = "https://discovery-us-01.audius.openplayer.org";

  useEffect(() => {
    fetchTrendingTracks();
    loadRandomImages();
    populateGenreSelect();
  }, []);

  useEffect(() => {
    dispatch(setTracks(playlist));
  }, [playlist, dispatch]);

  const fetchTrendingTracks = async () => {
    try {
      const response = await fetch(
        `${AUDIUS_API_HOST}/v1/tracks/trending?app_name=MusicBox&time=week&limit=10`
      );
      const data = await response.json();
      setPlaylist(data.data);
    } catch (error) {
      console.error("Error fetching trending tracks:", error);
    }
  };

  const loadRandomImages = () => {
    // Implementation for loading random images
  };

  const populateGenreSelect = () => {
    setGenres(genreList);
  };

  const playTrack = (track) => {
    setCurrentTrack(track);
    // Logic to play the track using audio API
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Logic to handle play/pause functionality
  };

  const addToFavorites = () => {
    if (currentTrack && !favorites.some((fav) => fav.id === currentTrack.id)) {
      setFavorites([...favorites, currentTrack]);
      alert(`Added "${currentTrack.title}" to favorites!`);
    }
  };

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
        <h1 className="font-semibold text-5xl">
          Trending <span className="text-[#EE10B0]">Songs</span>
        </h1>
        <div>
          <div className="w-3/4 mx-auto">
            <div>
              <span>No</span>
              <span>Artwork</span>
              <span>Title</span>
              <span>Artist</span>
            </div>
            <div>
              {playlist.map((track, index) => (
                <div
                  key={track.id || index}
                  className="bg-[#1E1E1E] lg:flex max-lg:text-center justify-start items-center gap-4 my-3 rounded hover:bg-[#666666] transition duration-500 cursor-pointer py-2 px-4 active:scale-95"
                >
                  <div className="grow-0 text-lg"># {index + 1}</div>
                  <div>
                    <img
                      src={
                        track.artwork
                          ? track.artwork["150x150"]
                          : "https://app.pinetwork.com/images/default-album-art.png"
                      }
                      alt={`${track.title} artwork`}
                      width={50}
                      className="mx-auto"
                    />
                  </div>
                  <div className="grow flex flex-col">
                    <div className="text-base">{track.title}</div>
                    <div className="text-sm">{track.user.name}</div>
                  </div>
                  <div className="grow-0 text-sm">
                    {track.release_date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
