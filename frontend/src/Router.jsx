import Login from "./authUI/login";
import { Route, Routes, Navigate } from "react-router-dom";
import Register from "./authUI/register";
// import Profile from "./authUI/profile";
import Home from "./Home/home";

import { setUser } from "./redux/reducer/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Projects from "./Projects/ProjectListing";

import Feed from "./SocialMediaApp/Feed";
import UserProfile from "./SocialMediaApp/UserProfile";
import ChatPage from "./SocialMediaApp/chat/chatPage";
import axios from "axios";
import { API_URL } from "../constant";
import { useEffect } from "react";

const refreshData = async () => {
  try {
    let accessToken = localStorage.getItem("accessToken");
    console.log(accessToken, "ddddd");
    if (accessToken) {
      let response = await axios.get(`${API_URL}/v1/auth/refresh-user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Correct way to send authorization header
        },
      });
      console.log(response, "dadaadda");
      if (response.status === 200) {
        return { data: response?.data?.data };
      } else {
        console.log("No access token found");
      }
    }
  } catch (error) {
    let refreshToken = localStorage.getItem("refreshToken");
    let response2 = await axios.get(`${API_URL}/v1/auth/refresh-token`, {
      headers: {
        Authorization: `Bearer ${refreshToken}`, // Correct way to send authorization header
      },
    });
    if (response2.status === 200) {
      localStorage.setItem("accessToken", response2?.data?.data.accessToken);
      localStorage.setItem("refreshToken", response2?.data?.data.refreshToken);
      return { data: response2?.data?.data };
    }
  }
};

const Routers = () => {
  let user = useSelector((state) => state?.user);
  let dispatch = useDispatch();
  let token = localStorage.getItem("accessToken");
  let userdata = localStorage.getItem("user");
  console.log(token, userdata, user.token, user, "www");
  useEffect(() => {
    if ((!user?.token || !user?.user) && (token || userdata)) {
      refreshData().then((res) => {
        dispatch(setUser({ user: res.data, token }));

        // Save the new token and user data to localStorage

        localStorage.setItem("user", JSON.stringify(res.data));
      });
    }
  }, []);

  // let accessToken = localStorage.getItem("accessToken")
  //  axios.get(`${API_URL}/auth/v1/refresh-token`, {
  //   Authorization: `Bearer ${accessToken}`
  // }).then(res =>{
  //   return res.JSON()
  // }).then(data =>{
  //   dispatch(setUser({ user: data.data, token: data.accessToken }));
  //  localStorage.setItem("accessToken" , data.accessToken)
  //  localStorage.setItem("user" , JSON.stringify(data.data))
  // });

  return (
    <>
      <Routes>
        {token ? (
          <Route path="/profile" element={<UserProfile />} />
        ) : (
          <Route path="/login" element={<Login />} />
        )}

        <Route path="/account" element={<Register />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/feed" element={<Feed />} />
        {/* <Route path="/socialmedia/profile" element={<UserProfile />} /> */}
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
};

export default Routers;
