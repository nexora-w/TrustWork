import { createSlice } from '@reduxjs/toolkit';

const TracksSlice = createSlice({
  name: 'Tracks',
  initialState: {
    tracks: [],
  },
  reducers: {
    setTracks: (state, action) => {
      state.tracks = action.payload;      
      console.log(state.tracks);  
    }
    
  },
});

export const { setTracks } = TracksSlice.actions;
export default TracksSlice.reducer;