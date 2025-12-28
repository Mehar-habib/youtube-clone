import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

export default function getCurrentUser() {
  const dispatch = useDispatch();
  const { channelData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/user/get-user", {
          withCredentials: true,
        });
        dispatch(setUserData(result.data));
        console.log(result.data);
      } catch (error) {
        console.error(error);
        dispatch(setUserData(null));
      }
    };
    fetchUser();
  }, [channelData]);
}
