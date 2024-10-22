import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { nextTrack, previousTrack } from "../store/slices/tracks"; // Update path accordingly

const MiniAudioControl = React.memo(() => {
  const dispatch = useDispatch();
  const currentTrack = useSelector((state) => state.tracks.currentTrack);
  const tracks = useSelector((state) => state.tracks.allTracks); // Assuming you have a list of tracks
  const audioRef = useRef(null);

  const AUDIUS_API_HOST = "https://discovery-us-01.audius.openplayer.org";

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = `${AUDIUS_API_HOST}/v1/tracks/${currentTrack.id}/stream?app_name=MusicBox`;
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      const updateCurrentTime = () => {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      };

      audio.addEventListener("timeupdate", updateCurrentTime);
      audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));

      return () => {
        audio.removeEventListener("timeupdate", updateCurrentTime);
      };
    }
  }, [audioRef.current]); // This dependency can be kept to listen to changes

  const handleNext = () => {
    dispatch(nextTrack()); // Dispatch action to get the next track
  };

  const handlePrevious = () => {
    dispatch(previousTrack()); // Dispatch action to get the previous track
  };

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration; // Calculate new time based on progress bar value
    if (audioRef.current) {
      audioRef.current.currentTime = newTime; // Update audio current time
      setCurrentTime(newTime); // Update state
    }
  };

  return (
    <>
      {currentTrack && (
        <div className="fixed bottom-0 right-0 left-0 bg-transparent shadow-lg p-4">
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
            <input
              type="range"
              value={(currentTime / duration) * 100 || 0} // Calculate progress percentage
              onChange={handleProgressChange}
              className="w-full mt-2 cursor-pointer"
              min="0"
              max="100"
              style={{ appearance: 'none', height: '5px', borderRadius: '5px', background: '#ccc' }}
              onMouseDown={() => { if (audioRef.current) audioRef.current.pause(); setIsPlaying(false); }} // Pause on mouse down
              onMouseUp={() => { if (audioRef.current) audioRef.current.play(); setIsPlaying(true); }} // Play on mouse up
            />
            <div className="flex justify-center items-center gap-3 w-full mt-2">
              <button
                className="bg-gray-700 text-white rounded py-2 px-4"
                onClick={handlePrevious}
              >
                Previous
              </button>
              <button
                className="bg-gray-700 text-white rounded py-2 px-4"
                onClick={() => setIsPlaying(!isPlaying)} // Toggle play/pause
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button
                className="bg-gray-700 text-white rounded py-2 px-4"
                onClick={handleNext}
              >
                Next
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
