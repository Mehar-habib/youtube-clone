import { createSlice } from "@reduxjs/toolkit";

const contentSlice = createSlice({
  name: "content",
  initialState: {
    allVideosData: null,
    allShortsData: null,
  },
  reducers: {
    setAllVideosData: (state, action) => {
      state.allVideosData = action.payload;
    },
    setAllShortData: (state, action) => {
      state.allShortsData = action.payload;
    },
  },
});

export const { setAllVideosData, setAllShortData } = contentSlice.actions;
export default contentSlice.reducer;
