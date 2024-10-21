import { createSlice } from '@reduxjs/toolkit';

const TracksSlice = createSlice({
  name: 'Tracks',
  initialState: {
    allTracks: [],
    demoTrack: [],
    currentTrack: null, // Initialize as null for clarity
  },
  reducers: {
    setTracks: (state, action) => {
      state.allTracks = action.payload;
      state.demoTrack = action.payload.slice(0, 10);   
      state.currentTrack = action.payload[0] || null; // Set first track or null if empty
      console.log(state.currentTrack);
    },
    nextTrack: (state) => {
      if (state.allTracks.length > 0) {
        const currentIndex = state.allTracks.findIndex(track => track.id === state.currentTrack.id);
        const nextIndex = (currentIndex + 1) % state.allTracks.length; // Loop to first track
        state.currentTrack = state.allTracks[nextIndex];
      }
    },
    previousTrack: (state) => {
      if (state.allTracks.length > 0) {
        const currentIndex = state.allTracks.findIndex(track => track.id === state.currentTrack.id);
        const prevIndex = (currentIndex - 1 + state.allTracks.length) % state.allTracks.length; // Loop to last track
        state.currentTrack = state.allTracks[prevIndex];
      }
    },
  },
});

// Export actions and reducer
export const { setTracks, nextTrack, previousTrack } = TracksSlice.actions;
export default TracksSlice.reducer;
