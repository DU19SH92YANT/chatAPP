import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../../constant";
import ChatPageHeader from "./chatPageHeader";
import SideDrawer from "./miscellaneous/sideDrawer";
import MyBox from "./miscellaneous/MyBox";
import MyChats from "./miscellaneous/MyChats";
import { Box } from "@mui/material";
import { setChats } from "../../redux/reducer/chatSlice";
import { useDispatch } from "react-redux";

const ChatPage = () => {
  const [opensideBarState, setOpenSidebarState] = useState(false); // Ensure default state is false
  const dispatch = useDispatch();

  const fetchChatData = async () => {
    try {
      let token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`${API_URL}/v1/chat`, config);
      console.log(data, "chatdata");
      if (data?.length > 0) {
        dispatch(setChats({ chats: data }));
      }
    } catch (error) {
      console.error("Error fetching chat data:", error.message);
    }
  };

  useEffect(() => {
    fetchChatData();
  }, []);

  return (
    <>
      <ChatPageHeader setOpenSidebarState={setOpenSidebarState} />
      <SideDrawer
        setOpenSidebarState={setOpenSidebarState}
        opensideBarState={opensideBarState}
        fetchChatData={fetchChatData} // Pass the correct props to SideDrawer
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "99vw", // Fixed "100%vw" typo
          height: "calc(100vh - 125px)",
          background: "#c2eafc",
        }}
      >
        <MyChats />
        <MyBox />
      </Box>
    </>
  );
};

export default ChatPage;
