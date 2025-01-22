import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { API_URL } from "../../constant";
import { updateUserProfile } from "../redux/reducer/userSlice";

const UserProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // Store the preview URL
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const dummyUser = {
    profilePicture:
      user?.user?.profilePicture ||
      "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    name: user?.user?.name || "John Doe",
    email: user?.user?.email || "johndoe@example.com",
    bio: user?.user?.bio || "Passionate developer and lifelong learner.",
    location: user?.user?.location || "New York, USA",
  };

  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    bio: yup.string().required("Bio is required"),
    location: yup.string().required("Location is required"),
  });

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: dummyUser,
    resolver: yupResolver(schema),
  });

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Use URL.createObjectURL for preview
      setValue("profilePicture", file); // Save the file to form data
    }
  };

  // Submit Form
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("bio", data.bio);
    formData.append("location", data.location);
    if (data.profilePicture instanceof File) {
      formData.append("profilePicture", data.profilePicture);
    }

    try {
      const response = await axios.post(
        `${API_URL}/v1/auth/update-profile/${user?.user?._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log(response, "resopose");
      if (response.status === 200) {
        response?.data &&
          localStorage.setItem("user", JSON.stringify(response?.data));
        dispatch(updateUserProfile({ user: response.data }));
        setEditMode(false);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Profile update failed");
    }
  };

  const handleEdit = (e) => {
    console.log(e, "eeee");
    setEditMode(!editMode);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Card
        sx={{ maxWidth: 600, width: "100%", boxShadow: 3, borderRadius: 3 }}
      >
        <CardHeader
          title={<Typography variant="h5">User Profile</Typography>}
          subheader="Manage your profile details"
          sx={{ backgroundColor: "#1976d2", color: "#fff" }}
        />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              {/* Profile Picture */}
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="profilePictureInput"
                  disabled={!editMode}
                  onChange={handleImageChange}
                />
                <label htmlFor="profilePictureInput">
                  <Avatar
                    alt="Profile Picture"
                    src={imagePreview || dummyUser.profilePicture}
                    sx={{ width: 120, height: 120, cursor: "pointer" }}
                  />
                </label>
              </Grid>

              {/* Name */}
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      fullWidth
                      label="Name"
                      {...field}
                      error={!!error}
                      helperText={error?.message}
                      variant="outlined"
                      disabled={!editMode}
                    />
                  )}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      fullWidth
                      label="Email"
                      {...field}
                      error={!!error}
                      helperText={error?.message}
                      variant="outlined"
                      disabled={!editMode}
                    />
                  )}
                />
              </Grid>

              {/* Bio */}
              <Grid item xs={12}>
                <Controller
                  name="bio"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      fullWidth
                      label="Bio"
                      {...field}
                      multiline
                      rows={3}
                      error={!!error}
                      helperText={error?.message}
                      variant="outlined"
                      disabled={!editMode}
                    />
                  )}
                />
              </Grid>

              {/* Location */}
              <Grid item xs={12}>
                <Controller
                  name="location"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      fullWidth
                      label="Location"
                      {...field}
                      error={!!error}
                      helperText={error?.message}
                      variant="outlined"
                      disabled={!editMode}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Divider sx={{ marginY: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              {editMode && (
                <>
                  <Button type="submit" variant="contained" color="success">
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={(e) => handleEdit(e)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Box>
          </form>
          {!editMode && (
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => handleEdit(e)}
            >
              Edit Profile
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfile;
