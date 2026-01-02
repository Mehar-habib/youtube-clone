import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setAllShortData, setAllVideosData } from "../redux/contentSlice";

export default function getAllContentData() {
  const dispatch = useDispatch();
  const { channelData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchAllVideos = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/content/get-videos", {
          withCredentials: true,
        });
        dispatch(setAllVideosData(result.data));
        console.log(result.data);
      } catch (error) {
        console.error(error);
        dispatch(setAllVideosData(null));
      }
    };
    fetchAllVideos();
  }, [channelData]);

  useEffect(() => {
    const fetchAllShorts = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/content/get-shorts", {
          withCredentials: true,
        });
        dispatch(setAllShortData(result.data));
        console.log(result.data);
      } catch (error) {
        console.error(error);
        dispatch(setAllShortData(null));
      }
    };
    fetchAllShorts();
  }, [channelData]);
}
