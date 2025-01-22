import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    chats: [],
    notifications: [],
    selectedChat: undefined,
  },
  reducers: {
    // Sets the initial user and token
    setUsers(state, action) {
      console.log(action, "Setting Users");
      state.users = [...action.payload.users];
    },

    setChats(state, action) {
      console.log(action, "Setting Users");
      state.chats = [...action.payload.chats];
    },

    updateNotifications(state, action) {
      state.notifications = [...action.payload.notifications];

      console.log(state.chats, "Updated Chats");
    },

    setSelectedChats(state, action) {
      console.log(action, "Setting Users");
      state.selectedChat = action.payload.selectedChat;
    },
  },
});

export const {
  setUsers,
  setChats,
  setSelectedChats,
  updateChats,
  updateNotifications,
} = chatSlice.actions;
export default chatSlice.reducer;
