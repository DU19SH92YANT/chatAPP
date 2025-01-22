import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { TextField, Tooltip, Typography } from "@mui/material";
import axios from "axios";
import { API_URL } from "../../../../constant";
import { setChats, updateChats } from "../../../redux/reducer/chatSlice";
import { useDispatch, useSelector } from "react-redux";

export default function SideDrawer({
  setOpenSidebarState,
  opensideBarState,
  fetchChatData,
}) {
  const chats = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState();
  const [loadingChat, setLoadingChat] = React.useState();
  const [search, setSearch] = React.useState();
  const [searchResult, setSearchResult] = React.useState();
  const [selectedChat, setSelectedChat] = React.useState();
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
    setOpenSidebarState(newOpen);
  };

  const preventClose = (event) => {
    event.stopPropagation();
  };

  const accessChat = async (userId) => {
    try {
      let accessToken = localStorage.getItem("accessToken");
      console.log(accessToken, "token", userId);
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Correct way to send authorization header
        },
      };
      const { data } = await axios.post(
        `${API_URL}/v1/chat`,
        {
          userId, // Request body
        },
        config // Configuration object
      );

      fetchChatData();
    } catch (error) {}
  };

  const handleSearch = async (query) => {
    console.log(query, "query");
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      let token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(
        `${API_URL}/v1/chat/searchUsers?search=${query}`,
        config
      );
      console.log(data, "datatata");
      setSearchResult(data);
    } catch (error) {}
  };

  React.useEffect(() => {
    setOpen(opensideBarState);
  }, [opensideBarState]);
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <Box mt={2} sx={{ display: "flex" }}>
        <TextField
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          onClick={preventClose}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderTopRightRadius: "0px",
              borderBottomRightRadius: "0px", // Customize border radius
            },
          }}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button
          sx={{
            borderTopLeftRadius: "0px",
            borderBottomLeftRadius: "0px",
          }}
          variant="contained"
          onClick={preventClose}
        >
          M
        </Button>
      </Box>
      <List>
        {searchResult?.length > 0 &&
          searchResult?.map((user) => (
            <ListItem
              key={user?._id}
              disablePadding
              onClick={() => accessChat(user._id)}
              sx={{ cursor: "pointer" }}
            >
              <Typography>{user?.name}</Typography>
            </ListItem>
          ))}
      </List>
    </Box>
  );

  return (
    <>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </>
  );
}
