import axios from "axios";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { useEffect } from "react";
import {
  setSubscribedChannels,
  setSubscribedPlaylists,
  setSubscribedPosts,
  setSubscribedShorts,
  setSubscribedVideos,
} from "../redux/userSlice";

const GetSubscribedData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSubscribedData = async () => {
      try {
        const result = await axios.get(
          serverUrl + "/api/user/subscribed-data",
          {
            withCredentials: true,
          },
        );
        dispatch(setSubscribedChannels(result.data.subscribedChannels));
        dispatch(setSubscribedVideos(result.data.videos));
        dispatch(setSubscribedPosts(result.data.posts));
        dispatch(setSubscribedShorts(result.data.shorts));
        dispatch(setSubscribedPlaylists(result.data.playlists));
      } catch (error) {
        console.error(error);
      }
    };
    fetchSubscribedData();
  }, []);
};

export default GetSubscribedData;
