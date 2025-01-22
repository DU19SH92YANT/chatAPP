import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logoutUser } from "../redux/reducer/userSlice";
const Profile = () => {
  let dispatch = useDispatch();
  const navigate = useNavigate();
  let user = useSelector((state) => state?.user);
  let logoutHandler = async () => {
    try {
      let token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${window.location.origin}/v1/auth/logout`,
        {}, // Request body, if needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        dispatch(logoutUser({ user: null, token: null }));
        navigate("/home");
      }

      alert("Logout successful");
    } catch (err) {
      // if(err?.response?.data?.error){

      // }
      alert(err?.response?.data?.error || "Logout failed");
    }
  };

  return (
    <div>
      <Typography gutterBottom variant="h5" component="div">
        {user?.user?.name ? `You Name is ${user?.user?.name}` : ""}
      </Typography>
      <Typography gutterBottom variant="h5" component="div">
        {user?.user?.name ? `You Email is ${user?.user?.email}` : ""}
      </Typography>
      {user?.user?.name ? (
        <Button variant="contained" onClick={logoutHandler}>
          Logout
        </Button>
      ) : (
        <Button variant="contained" onClick={navigate("/login")}>
          Login
        </Button>
      )}
    </div>
  );
};

export default Profile;
