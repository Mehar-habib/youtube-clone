import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { setShortHistory, setVideoHistory } from "../redux/userSlice";

const GetHistory = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/user/get-history", {
          withCredentials: true,
        });
        const history = result.data;
        const videos = history.filter((v) => v.contentType === "Video");
        const shorts = history.filter((v) => v.contentType === "Short");
        dispatch(setVideoHistory(videos));
        dispatch(setShortHistory(shorts));
      } catch (error) {
        console.error(error);
        dispatch(setVideoHistory(null));
        dispatch(setShortHistory(null));
      }
    };
    fetchHistory();
  }, []);
};

export default GetHistory;
