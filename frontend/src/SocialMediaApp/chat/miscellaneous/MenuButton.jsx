import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { getSender } from "../chatLogic";

export default function MenuButton() {
  let chats = useSelector((state) => state.chat);
  let users = useSelector((state) => state.user);
  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <Button variant="contained" {...bindTrigger(popupState)}>
            M
          </Button>

          <Menu {...bindMenu(popupState)}>
            {chats.notification?.length > 0 ? (
              chats.notification.map((noti) => (
                <MenuItem key={noti?._id} onClick={popupState.close}>
                  {noti?.chat?.isGrouptCaht
                    ? `New Message in ${noti?.chatName}`
                    : `New Message from ${getSender(users.user, noti.chat.users)}`}
                </MenuItem>
              ))
            ) : (
              <MenuItem>
                <Typography>No notifications</Typography>
              </MenuItem>
            )}
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}
