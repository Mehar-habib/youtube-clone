import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    channelData: null,
    allChannelData: null,
    subscribedChannels: [],
    subscribedVideos: [],
    subscribedShorts: [],
    subscribedPlaylists: [],
    subscribedPosts: [],
    historyVideo: null,
    historyShort: null,
    recommendedContent: null,
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
    setSubscribedChannels: (state, action) => {
      state.subscribedChannels = action.payload;
    },
    setSubscribedVideos: (state, action) => {
      state.subscribedVideos = action.payload;
    },
    setSubscribedShorts: (state, action) => {
      state.subscribedShorts = action.payload;
    },
    setSubscribedPlaylists: (state, action) => {
      state.subscribedPlaylists = action.payload;
    },
    setSubscribedPosts: (state, action) => {
      state.subscribedPosts = action.payload;
    },
    setVideoHistory: (state, action) => {
      state.historyVideo = action.payload;
    },
    setShortHistory: (state, action) => {
      state.historyShort = action.payload;
    },
    setRecommendedContent: (state, action) => {
      state.recommendedContent = action.payload;
    },
  },
});

export const {
  setUserData,
  setChannelData,
  setAllChannelData,
  setSubscribedChannels,
  setSubscribedVideos,
  setSubscribedShorts,
  setSubscribedPlaylists,
  setSubscribedPosts,
  setVideoHistory,
  setShortHistory,
  setRecommendedContent,
} = userSlice.actions; //ek action creator hai. Ye ek function return karta hai jo payload ke saath state update karega.
export default userSlice.reducer; //ko store me add karte hain taki ye global state manage kare.
