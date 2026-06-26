import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connection",
  initialState: [],
  reducers: {
    addConnection: (_state, action) => {
      return action.payload;
    },
    removeConnection: () => {
      return [];
    },
  },
});

export const { addConnection, removeConnection } = connectionSlice.actions;
export default connectionSlice.reducer;