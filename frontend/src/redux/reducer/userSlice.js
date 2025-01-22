import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    token: null,
  },
  reducers: {
    // Sets the initial user and token
    setUser(state, action) {
      console.log(action, "Setting User");
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    // Updates the user's profile data
    updateUserProfile(state, action) {
      console.log(action, "updateprofile");
      
        state.user =  action.payload.user ; // Merge updated fields
      
    },

    // Logs out the user and clears the state
    logoutUser(state) {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, updateUserProfile, logoutUser } = userSlice.actions;
export default userSlice.reducer;