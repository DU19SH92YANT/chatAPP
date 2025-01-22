/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  Chip,
  Fade,
  Modal,
  Paper,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import axios from "axios";
import { API_URL } from "../../../../constant";

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

const GroupChatModel = ({ children }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const [disableSubmitButton, setDisableSubmitButton] = useState(true);

  //   const {user , chats , setChats} = redux
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

  const handleClick = (addToUser) => {
    if (selectedUsers.includes(addToUser)) {
      return;
    }

    setSelectedUser([...selectedUsers, addToUser]);
    let data = searchResult.filter((user) => user?._id !== addToUser?._id);
    setSearchResult(data);
  };

  const handleDelete = (removeUser) => {
    if (!selectedUsers.includes(removeUser)) {
      return;
    }
    let remainingUser = selectedUsers.filter(
      (user) => user._id !== removeUser?._id
    );
    setSelectedUser(remainingUser);

    setSearchResult([...searchResult, removeUser]);
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
      <Button onClick={handleOpen}>{children}</Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={{ ...style, overflowY: "scroll" }}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Create Group Chats
            </Typography>
            <Box
              component="div"
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between", // Use this for spacing between items
              }}
            >
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
              <Box>
                {selectedUsers &&
                  selectedUsers?.map((user) => (
                    <Chip
                      key={user._id}
                      label={user.name}
                      //   onClick={handleChipClick}
                      onDelete={() => handleDelete(user)}
                    />
                  ))}
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
                Submit
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default GroupChatModel;
