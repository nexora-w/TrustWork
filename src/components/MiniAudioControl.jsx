import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { nextTrack, previousTrack } from "../store/slices/tracks"; // Update path accordingly
import {
  FastBackwardFilled,
  FastForwardFilled,
  PauseCircleFilled,
  PlayCircleFilled,
  RetweetOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons"; // Import icons

const MiniAudioControl = React.memo(() => {
  const dispatch = useDispatch();
  const currentTrack = useSelector((state) => state.tracks.currentTrack);
  const audioRef = useRef(null);
  const AUDIUS_API_HOST = "https://discovery-us-01.audius.openplayer.org";

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRepeating, setIsRepeating] = useState(false); // State for repeat mode
  const [isFavorite, setIsFavorite] = useState(false); // State for favorite

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = `${AUDIUS_API_HOST}/v1/tracks/${currentTrack.id}/stream?app_name=MusicBox`;
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;

    const updateCurrentTime = () => {
      if (audio) {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      }
    };

    const intervalId = setInterval(updateCurrentTime, 1000); // Update every second

    if (audio) {
      audio.addEventListener("timeupdate", updateCurrentTime);
      audio.addEventListener("ended", handleTrackEnd); // Listen for track end
    }

    return () => {
      clearInterval(intervalId); // Clear the interval on cleanup
      if (audio) {
        audio.removeEventListener("timeupdate", updateCurrentTime);
        audio.removeEventListener("ended", handleTrackEnd); // Clean up listener
      }
    };
  }, []);

  const handleTrackEnd = () => {
    if (isRepeating) {
      audioRef.current.currentTime = 0; // Restart the track
      audioRef.current.play(); // Play again
    } else {
      handleNext(); // Go to the next track
    }
  };

  const handleNext = () => {
    dispatch(nextTrack());
  };

  const handlePrevious = () => {
    dispatch(previousTrack());
  };

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const toggleRepeat = () => {
    setIsRepeating(!isRepeating); // Toggle repeat state
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite); // Toggle favorite state
  };

  return (
    <>
      {currentTrack && (
        <div className="fixed lg:bottom-5 bottom-0 right-1/2 max-lg:translate-x-1/2 lg:right-5 lg:w-1/5 w-full bg-[#1d1d1d] p-4 rounded border">
          <audio ref={audioRef} />
          <div className="flex flex-col items-center">
            <h3 className="text-lg">{currentTrack.title}</h3>
            <h4 className="text-sm">{currentTrack.user?.name}</h4>
            <img
              src={
                currentTrack.artwork
                  ? currentTrack.artwork["150x150"]
                  : "https://app.pinetwork.com/images/default-album-art.png"
              }
              alt={`${currentTrack.title} artwork`}
              className="mt-2 mb-2"
              width={150}
            />
            <div className="flex justify-between w-full text-white">
              <span className="text-sm">
                {formatTime(currentTime) || "--:--"}
              </span>
              <span className="text-sm">
                {duration ? formatTime(duration) : "--:--"}
              </span>
            </div>
            <input
              type="range"
              value={(currentTime / duration) * 100 || 0}
              onChange={handleProgressChange}
              className="w-full mt-2 cursor-pointer"
              min="0"
              max="100"
            />
            <div className="flex justify-center items-center gap-2 w-full mt-2">
              <button
                className="text-white rounded py-2 px-4"
                onClick={toggleFavorite}
              >
                {isFavorite ? (
                  <StarFilled className="text-3xl text-yellow-500" />
                ) : (
                  <StarOutlined className="text-3xl text-white" />
                )}
              </button>
              <button
                className="text-white rounded py-2 px-4"
                onClick={handlePrevious}
              >
                <FastBackwardFilled className="text-3xl" />
              </button>
              <button
                className="text-white rounded py-2 px-4"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {!isPlaying ? (
                  <PlayCircleFilled className="text-3xl" />
                ) : (
                  <PauseCircleFilled className="text-3xl" />
                )}
              </button>
              <button
                className="text-white rounded py-2 px-4"
                onClick={handleNext}
              >
                <FastForwardFilled className="text-3xl" />
              </button>
              <button
                className="text-white rounded py-2 px-4"
                onClick={toggleRepeat}
              >
                <RetweetOutlined
                  className={`text-3xl ${
                    isRepeating ? "text-green-500" : "text-white"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

// PropTypes validation
MiniAudioControl.propTypes = {
  currentTrack: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    user: PropTypes.shape({
      name: PropTypes.string,
    }),
    artwork: PropTypes.string,
    duration: PropTypes.number,
  }),
};

export default MiniAudioControl;
