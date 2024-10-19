"use client";

import { useEffect, useState } from "react";
import Loader from "./loader";
import { BookOutlined, BookTwoTone } from "@ant-design/icons";

const MusicBox = () => {
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
    const genreList = [
      "Favorites",
      "Trending",
      "Audiobooks",
      "Electronic",
      "Rock",
      "Metal",
      "Alternative",
      "Hip-Hop/Rap",
      "Experimental",
      "Punk",
      "Folk",
      "Pop",
      "Ambient",
      "Soundtrack",
      "World",
      "Jazz",
      "Acoustic",
      "Funk",
      "R&B/Soul",
      "Instrumental",
      "House",
      "Techno",
      "Classical",
      "Country",
      "Reggae",
      "Blues",
      "Indie",
      "Dance",
      "Latin",
      "Singer-Songwriter",
      "Trap",
      "Drum & Bass",
      "Trance",
      "Dubstep",
      "Disco",
    ];
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
  console.log(playlist);
  
  return (
    <div>
      <header>
        <h1>MusicBox</h1>
        <p>Powered by Audius</p>
        <button
          id="user-button"
          onClick={() => {
            /* Open user modal */
          }}
        >
          User
        </button>
      </header>
      <main>
        <div className="card music-player">
          <h2>Music Player</h2>
          <div id="search-container">
            <button id="search-button">Search Tracks</button>
            <select id="genre-select" className="genre-select">
              <option value="">Select a genre</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          <h3 id="playlist-heading">Trending Tracks</h3>
          <ul
            id="playlist"
            className="grid grid-cols-5 gap-10 overflow-x-hidden w-4/5 border px-3 py-24 mx-auto !h-[50vh] overflow-y-scroll bg-[#212121] relative"
          >
            {playlist.length === 0 && (
              <li className="h-full w-full flex items-center justify-center absolute top-0 bottom-0 left-0 right-0">
                <Loader />
              </li>
            )}
            {playlist.map((track) => (
              <li
                key={track.id}
                onClick={() => playTrack(track)}
                className="flex flex-col items-center justify-center px-8 pt-12 pb-5 bg-[#fff] h-auto rounded-md drop-shadow-xl"
              >
                <img
                  src={
                    track.artwork
                      ? track.artwork["150x150"]
                      : "https://app.pinetwork.com/images/default-album-art.png"
                  }
                  alt={`${track.title} artwork`}
                  className="w-3/5"
                />
                <div className="w-full h-2/5 py-1">
                  <div className="text-center">
                    <strong>{track.title}</strong>
                  </div>
                  <div>
                    <small>{track.user.name}</small>
                  </div>
                </div>
                <div className="flex justify-around items-center">
                  <BookOutlined className="hover:text-blue-500 transition cursor-pointer" />
                  <BookTwoTone className="cursor-pointer" />
                </div>
              </li>
            ))}
          </ul>
          <button id="load-more-btn">Load More</button>
        </div>
      </main>
      <div id="floating-player">{/* Floating player implementation */}</div>
      <div id="user-modal" className="modal">
        {/* User modal implementation */}
      </div>
      {/* <script src="https://sdk.minepi.com/pi-sdk.js"></script> */}
    </div>
  );
};

export default MusicBox;
