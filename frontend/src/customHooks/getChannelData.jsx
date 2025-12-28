import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { setChannelData } from "../redux/userSlice";

export default function getChannelData() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/user/get-channel", {
          withCredentials: true,
        });
        dispatch(setChannelData(result.data));
        console.log(result.data);
      } catch (error) {
        console.error(error);
        dispatch(setChannelData(null));
      }
    };
    fetchChannelData();
  }, []);
}
