import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useSelector } from "react-redux";
import Chip from "@mui/material/Chip";
import { Paper, Stack, styled, TextField } from "@mui/material";
import { API_URL } from "../../../../constant";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 300,

  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const UpdateGroupChat = () => {
  const chats = useSelector((state) => state.chat);
  const [selectedUsers, setSelectedUsers] = useState([
    ...(chats?.selectedChat?.users || []),
  ]);
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [searchResult, setSearchResult] = useState();

  const [disableSubmitButton, setDisableSubmitButton] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(0),
    textAlign: "center",
    color: theme.palette.text.secondary,
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
  }));

  const handleDelete = (val) => {
    const remainingUser = selectedUsers.filter((user) => user?._id !== val._id);

    setSelectedUsers(remainingUser);
  };

  const handleSearch = async (query) => {
    console.log(query, "query");
    if (!query) {
      return;
    }

    try {
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

  const handleClick = (addToUser) => {
    console.log(
      selectedUsers,
      selectedUsers.some((user) => user._id === addToUser._id),
      addToUser,
      "111addToUsertrue"
    );
    if (selectedUsers.some((user) => user._id === addToUser._id)) {
      console.log(
        selectedUsers.some((user) => user._id === addToUser._id),
        addToUser,
        "addToUsertrue"
      );
      return;
    }
    console.log(addToUser, "addToUser");
    setSelectedUsers([...selectedUsers, addToUser]);
    let data = searchResult.filter((user) => user?._id !== addToUser._id);
    setSearchResult(data);
  };

  const handleName = (e) => {
    console.log(e, "e");
    setGroupChatName(e.target.value);
  };

  useEffect(() => {
    if (selectedUsers?.length > 2 && groupChatName) {
      setDisableSubmitButton(false);
      console.log(disableSubmitButton, "disablebutton");
    } else {
      setDisableSubmitButton(true);
    }
  }, [groupChatName, selectedUsers]);

  const addChat = async () => {
    return;
    let token = localStorage.getItem("accessToken");
    const config = {
      headers: {
        Authorization: `Beareb ${token}`,
      },
    };

    try {
      const { data } = await axios.post(
        `${API_URL}/v1/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers?.map((u) => u._id)),
        },
        config
      );

      // setChats([data,...chats])
    } catch (error) {}
  };

  return (
    <div>
      <Button onClick={handleOpen} endIcon={<VisibilityIcon />}></Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, overflowY: "scroll" }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {chats?.selectedChat?.chatName || "Group Chat"}
          </Typography>
          <Box sx={{ mt: 2 }}>
            {selectedUsers?.length > 0 ? (
              selectedUsers.map((user) => (
                <Chip
                  key={user._id}
                  label={user.name}
                  onDelete={() => handleDelete(user)}
                  sx={{ m: 0.5 }}
                />
              ))
            ) : (
              <Typography variant="body2">No users in this group.</Typography>
            )}
          </Box>

          <Box>
            <TextField
              required
              id="outlined-required"
              label="Chat Name"
              placeholder="Add Chat Group Name"
              sx={{ width: "100%" }}
              onChange={(e) => handleName(e)}
            />

            <TextField
              required
              id="outlined-required"
              label="Add Your Friends"
              placeholder="Search Atleast 3 friends"
              sx={{ width: "100%", marginTop: "20px" }}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Box>
          <Stack spacing={1}>
            {searchResult?.length > 0 &&
              searchResult?.map((user) => (
                <Item key={user._id}>
                  <Button
                    sx={{
                      width: "100%",
                      height: "30px",
                      padding: "0px",
                      margin: "0px",
                    }}
                    onClick={() => {
                      handleClick(user);
                    }}
                  >
                    {user.name}
                  </Button>
                </Item>
              ))}
          </Stack>

          <Button
            variant="contained"
            sx={{ marginBottom: "30px" }}
            disabled={disableSubmitButton}
            onClick={addChat}
          >
            Update Group
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default UpdateGroupChat;
