import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { HeartTwoTone } from "@ant-design/icons";

const Trending = () => {
  const playlist = useSelector((state) => state.tracks.demoTrack);

  return (
    <section className="min-h-screen text-white py-20 lg:px-[10%] px-[5%]">
      <h1 className="font-semibold xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl text-xl">
        Trending <span className="text-[#EE10B0]">Songs</span>
      </h1>
      <div className="mt-10">
        <div className="">
          <div>
            {playlist.length > 0 ? (
              playlist.map((track, index) => (
                <motion.div
                  key={track.id || index}
                  className="bg-[#1E1E1E] lg:flex max-lg:text-center justify-start items-center gap-4 my-3 rounded-lg hover:bg-[#666666] cursor-pointer py-2 px-4 border border-[#5e5e5e]"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  initial={{ x: -1000, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    duration: 0.2 * index,
                    type: "spring"
                  }}
                >
                  <div className="grow-0 text-lg"># {index + 1}</div>
                  <div>
                    <img
                      src={
                        track.artwork
                          ? track.artwork["150x150"]
                          : "https://app.pinetwork.com/images/default-album-art.png"
                      }
                      alt={`Album art for ${track.title} by ${
                        track.user?.name || "Unknown Artist"
                      }`}
                      width={50}
                      className="mx-auto"
                    />
                  </div>
                  <div className="grow flex flex-col">
                    <div className="text-base">{track.title}</div>
                    <div className="text-sm">
                      {track.user?.name || "Unknown Artist"}
                    </div>
                  </div>
                  <div className="grow-0 text-sm">{track.release_date}</div>
                  <div className="grow-0 text-sm">
                    <div>
                      {String(Math.floor(track.duration / 60)).padStart(2, "0")}{" "}
                      : {String(track.duration % 60).padStart(2, "0")}
                    </div>
                  </div>
                  <div className="grow-0 text-sm">
                    <HeartTwoTone twoToneColor="#eb2f96" />
                  </div>
                </motion.div>
              ))
            ) : (
              <div>Loading</div>
            )}
            <motion.button
              className="bg-[#1E1E1E] mx-auto lg:flex max-lg:text-center justify-start items-center gap-4 my-3 rounded-lg hover:bg-[#666666] cursor-pointer py-2 px-4 border border-[#5e5e5e]"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              View All
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trending;
