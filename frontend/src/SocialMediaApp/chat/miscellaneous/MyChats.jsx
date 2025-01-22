import { Box, Button, Paper, Stack, styled, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import GroupChatModel from "./GroupChatModel";
import { useDispatch, useSelector } from "react-redux";
import { set } from "react-hook-form";
import { setSelectedChats } from "../../../redux/reducer/chatSlice";
const MyChats = () => {
  const chats = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState();
  const [loadingChat, setLoadingChat] = useState();
  const [loggedUser, setLoggedUser] = useState();

  // redux
  // const {selectedChat , setSelectedChat , user , chats , setUsers} = state()

  const fetchChat = () => {};

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
  }));

  const handleSelectChat = (user) => {
    dispatch(setSelectedChats({ selectedChat: user }));
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("user")));
    fetchChat();
  }, []);

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        background: "white",
        width: "31vw", // Use either 31vw or 31% based on your layout
        height: "calc(100vh - 125px)", // Correct calc usage
        // borderRadius: "10px",
        border: "0px",
        // justifyContent: "space-between",
        margin: "2px",
        // Combine borderWidth and borderColor
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          // Combine borderWidth and borderColor
        }}
      >
        <Typography variant="h6">MyChats</Typography>
        <GroupChatModel>
          <Button variant="contained">New Group Chat</Button>
        </GroupChatModel>
      </Box>

      <Box sx={{ width: "100%", overflowY: "scroll", height: "100%" }}>
        <Stack spacing={1}>
          {chats?.chats?.length > 0 &&
            chats?.chats.map((chat) => (
              <Item key={chat._id} onClick={() => handleSelectChat(chat)}>
                <Button
                  variant="contained"
                  sx={{ width: "100%", height: "60px" }}
                >
                  <Typography>{chat?.chatName}</Typography>
                </Button>
              </Item>
            ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default MyChats;
