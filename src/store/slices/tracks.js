import { createSlice } from '@reduxjs/toolkit';

const TracksSlice = createSlice({
  name: 'Tracks',
  initialState: {
    tracks: [],
  },
  reducers: {
    setTracks: (state, action) => {
      state.tracks = action.payload
    }
  },
});

export const { increment, decrement } = TracksSlice.actions;
export default TracksSlice.reducer;