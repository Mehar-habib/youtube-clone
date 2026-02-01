import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    channelData: null,
    allChannelData: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setChannelData: (state, action) => {
      state.channelData = action.payload;
    },
    setAllChannelData: (state, action) => {
      state.allChannelData = action.payload;
    },
  },
});

export const { setUserData, setChannelData, setAllChannelData } =
  userSlice.actions; //ek action creator hai. Ye ek function return karta hai jo payload ke saath state update karega.
export default userSlice.reducer; //ko store me add karte hain taki ye global state manage kare.
