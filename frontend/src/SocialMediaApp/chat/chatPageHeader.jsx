import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import { Tooltip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuButton from "./miscellaneous/MenuButton";
import { useSelector } from "react-redux";

export default function ChatPageHeader({ setOpenSidebarState }) {
  const chats = useSelector((state) => state.chat);
  const handleSidedrawer = () => {
    setOpenSidebarState((prev) => !prev); // Corrected the function name
  };

  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          height: "40px",
          background: "#bbdefb",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <Box sx={{ marginTop: "auto" }}>
          <Tooltip title="Search Users to Chat">
            <Button onClick={handleSidedrawer}>
              <SearchIcon />
              <Typography variant="body1">Search User</Typography>
            </Button>
          </Tooltip>
        </Box>
        <Box
          sx={{
            height: "40px",
            background: "#bbdefb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <NotificationsIcon />
          </Box>
          <Box>
            <MenuButton />
          </Box>
        </Box>
      </AppBar>
    </Box>
  );
}
