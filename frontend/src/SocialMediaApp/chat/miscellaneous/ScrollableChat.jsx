import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameSenderMargin } from "../chatLogic";
import { useSelector } from "react-redux";
import { Avatar, Tooltip, Typography } from "@mui/material";

const ScrollableChat = ({ message }) => {
  const users = useSelector((state) => state.user);

  return (
    <ScrollableFeed>
      {message?.length > 0 &&
        message.map((m, i) => (
          <div
            key={m._id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            {/* Check if the sender's avatar needs to be shown */}
            {(isSameSender(message, m, i, users.user._id) ||
              isLastMessage(message, i, users.user._id)) && (
              <Tooltip title={m.sender.name}>
                <Avatar
                  alt={m.sender.name}
                  src={m.sender.profilePicture} // Assuming `m.sender.pic` holds the avatar URL
                  sx={{ cursor: "pointer", marginRight: "8px" }}
                />
              </Tooltip>
            )}

            {/* Display the message content */}
            <Typography
              sx={{
                background:
                  m.sender._id === users.user._id ? "#BEE3F8" : "#F3F3F3",
                color: "black",
                borderRadius: "20px",
                padding: "8px 16px",
                maxWidth: "70%",
                wordWrap: "break-word",
                marginLeft: isSameSenderMargin(message, m, i, users?.user._id),
              }}
            >
              {m.content}
            </Typography>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
