import React, { useEffect, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import {
  setSelectedChats,
  updateNotifications,
} from "../../../redux/reducer/chatSlice";
import { getSender } from "../chatLogic";
import UpdateGroupChat from "./UpdateGroupChat";
import axios from "axios";
import { API_URL } from "../../../../constant";
import ScrollableChat from "./ScrollableChat";
import "./singleStyle.css";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:8000"; // Socket.io server URL
let socket;

const SingleChats = () => {
  const chats = useSelector((state) => state.chat);
  const users = useSelector((state) => state.user);
  const [newMessage, setNewMessage] = useState("");
  const [message, setMessage] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingRoomId, setTypingRoomId] = useState();
  const [stopTyping, setStopTyping] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState();

  const dispatch = useDispatch();

  let selectedChatId = chats?.selectedChat?._id;
  console.log(selectedChatId, "chatsSelecte object");

  useEffect(() => {
    socket = io(ENDPOINT);
    if (users?.user) {
      socket.emit("setup", users?.user);
    }
    socket.on("connection", () => setSocketConnected(true));
    socket.on("typing", (room) => {
      setTypingRoomId(room);
    });
    socket.on("stop typing", (room) => {
      setStopTyping(room);
    });

    socket.on("message received", (newMessageReceived) => {
      setReceivedMessage(newMessageReceived);
    });
  }, [chats.selectedChat]);

  useEffect(() => {
    if (typingRoomId && typingRoomId === selectedChatId) {
      setIsTyping(true);
    }
  }, [typingRoomId]);

  useEffect(() => {
    if (stopTyping === selectedChatId) {
      setIsTyping(false);
    }
  }, [stopTyping]);

  useEffect(() => {
    console.log(receivedMessage, "receivedMessage");
    if (
      !chats?.selectedChat ||
      chats?.selectedChat?._id !== receivedMessage?.chat?._id
    ) {
      if (
        !chats.notifications.some((noti) => noti?._id === receivedMessage?._id)
      ) {
        dispatch(
          updateNotifications({
            notifications: [receivedMessage, ...chats.notifications],
          })
        );
      }
    } else {
      setMessage((prev) => [...prev, receivedMessage]);
    }
  }, [receivedMessage]);

  const fetchMessages = async () => {
    if (!chats.selectedChat) return;
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const { data } = await axios.get(
        `${API_URL}/v1/chat/message/${chats?.selectedChat?._id}`,
        config
      );
      setMessage(data);

      socket.emit("join chat", chats.selectedChat._id);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      e.preventDefault();
      socket.emit("stop typing", chats?.selectedChat?._id);
      try {
        const accessToken = localStorage.getItem("accessToken");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const { data } = await axios.post(
          `${API_URL}/v1/chat/message`,
          {
            content: newMessage,
            chatId: chats?.selectedChat?._id,
          },
          config
        );

        socket.emit("new message", data);
        setNewMessage("");
        setMessage([...message, data]);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;
    if (!typing) {
      setIsTyping(false);
      console.log(selectedChatId, "sending rrom id");
      socket.emit("typing", selectedChatId);
    }
    let lastTypingTime = new Date().getTime();
    let timeLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timeLength && typing) {
        console.log(timeDiff, timeLength, typing, "dddd");
        socket.emit("stop typing", chats.selectedChat._id);
        setTyping(false);
      }
    }, timeLength);
    setTyping(true);
  };

  useEffect(() => {
    fetchMessages();
  }, [chats.selectedChat]);

  return (
    <div>
      {chats?.selectedChat ? (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              height: "50px",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <ArrowCircleLeftIcon
                onClick={() =>
                  dispatch(setSelectedChats({ selectedChat: undefined }))
                }
              />
              {!chats.selectedChat?.isGroupChat ? (
                <Typography>
                  {getSender(users.user, chats?.selectedChat?.users)}
                </Typography>
              ) : (
                <Typography>
                  {chats?.selectedChat?.chatName.toUpperCase()}
                </Typography>
              )}
            </Box>
            {chats.selectedChat?.isGroupChat && <UpdateGroupChat />}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              background: "#E8E8E8",
              height: "calc(100vh - 225px)",
              overflow: "hidden",
            }}
            p={3}
          >
            <div className="message">
              <ScrollableChat message={message} />
            </div>
            {isTyping && <div>Typing...</div>}
            <TextField
              placeholder="Enter a message..."
              onKeyDown={(e) => sendMessage(e)}
              onChange={typingHandler}
              value={newMessage}
            />
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography>Click on a User to Start</Typography>
        </Box>
      )}
    </div>
  );
};

export default SingleChats;
