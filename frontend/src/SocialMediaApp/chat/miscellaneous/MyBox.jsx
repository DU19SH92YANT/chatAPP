import { Box } from "@mui/material";
import React from "react";
import SingleChats from "./SingleChats";
import { useSelector } from "react-redux";

const MyBox = () => {
  const chats = useSelector((state) => state.chat);
  const users = useSelector((state) => state.user);
  // redux
  // const {selectedChat} = chatState()

  return (
    <Box
      component="div"
      sx={{
        display: chats?.selectedChat ? "flex" : "none",
        flexDirection: "column",
        background: "white",
        width: "67vw", // Use either 31vw or 31% based on your layout
        height: "calc(100vh - 125px)", // Correct calc usage
        // borderRadius: "10px",
        border: "0px",
        // justifyContent: "space-between",
        margin: "2px",
        // Combine borderWidth and borderColor
      }}
    >
      <SingleChats />
    </Box>
  );
};

export default MyBox;
