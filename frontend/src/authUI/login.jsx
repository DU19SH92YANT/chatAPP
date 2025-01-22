import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { setUser } from "../redux/reducer/userSlice";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../constant";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log(data);

    try {
      const response = await axios.post(`${API_URL}/v1/auth/login`, {
        email: data.email,
        password: data.password,
      });

      if (response.status === 200) {
        localStorage.setItem("accessToken", response?.data?.data?.accessToken);
        localStorage.setItem(
          "refreshToken",
          response?.data?.data?.refreshToken
        );
        response?.data?.data?.user &&
          localStorage.setItem(
            "user",
            JSON.stringify(response?.data?.data?.user)
          );

        dispatch(
          setUser({
            user: response?.data?.data?.user,
            token: response?.data?.data?.accessToken,
          })
        );
        navigate("/profile");
      }

      alert("Login successful");
    } catch (err) {
      // if(err?.response?.data?.error){

      // }
      alert(err?.response?.data?.error || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        minWidth: 275,
        mx: "2px",
        transform: "scale(1)",
        display: "flex",
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
              sx={{ color: "text.secondary", fontSize: 24, fontWeight: "bold" }}
            >
              Sign In
            </Typography>
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
                    helperText={errors.password ? errors.password.message : ""}
                  />
                )}
              />
            </Box>
          </CardContent>
          <CardActions sx={{ display: "flex", justifyContent: "center" }}>
            <Button type="submit" variant="contained">
              Sign In
            </Button>
          </CardActions>
        </form>
      </Card>
    </Box>
  );
}
