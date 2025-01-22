import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, setUser } from "../redux/reducer/userSlice";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../constant";

const schema = yup.object().shape({
  fullName: yup.string().required("Full Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Registration() {
  const dispatch = useDispatch();
  let user = useSelector((state) => state?.user);
  console.log(user, "user");
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/v1/auth/register`, {
        name: data.fullName,
        email: data.email,
        password: data.password,
      });
      console.log(response, "response");
      if (response.status === 201) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        dispatch(setUser({ user: null, token: null }));
        navigate("/login");
      }

      alert("Login successful");
    } catch (err) {
      // if(err?.response?.data?.error){

      // }
      alert(err?.response?.data?.error || "Login failed");
    }
  };

  let logoutHandler = async () => {
    try {
      let token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_URL}/v1/auth/logout`,
        {}, // Request body, if needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response, "response");
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
    <>
      {user?.token ? (
        <Box sx={{ marginTop: "20px" }}>
          <Button type="submit" variant="contained" onClick={logoutHandler}>
            Logot
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            minWidth: 275,
            mx: "2px",
            transform: "scale(1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 100px)",
          }}
        >
          <Card variant="outlined" sx={{ minWidth: 300 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  gutterBottom
                  sx={{
                    color: "text.secondary",
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                >
                  Sign Up
                </Typography>
                <Box sx={{ marginBottom: "10px", width: "100%" }}>
                  <Controller
                    name="fullName"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Full Name"
                        type="text"
                        fullWidth
                        error={!!errors.fullName}
                        helperText={
                          errors.fullName ? errors.fullName.message : ""
                        }
                      />
                    )}
                  />
                </Box>
                <Box sx={{ marginBottom: "10px", width: "100%" }}>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Email"
                        type="email"
                        fullWidth
                        error={!!errors.email}
                        helperText={errors.email ? errors.email.message : ""}
                      />
                    )}
                  />
                </Box>
                <Box sx={{ width: "100%" }}>
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Password"
                        type="password"
                        fullWidth
                        error={!!errors.password}
                        helperText={
                          errors.password ? errors.password.message : ""
                        }
                      />
                    )}
                  />
                </Box>
              </CardContent>
              <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                <Button type="submit" variant="contained">
                  Sign Up
                </Button>
              </CardActions>
            </form>
          </Card>
          <Box sx={{ marginTop: "20px" }}>
            <Button
              type="submit"
              variant="contained"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
            <Typography
              gutterBottom
              sx={{ color: "text.secondary", fontSize: 24, fontWeight: "bold" }}
            >
              Sign In if already SignUP
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
}
