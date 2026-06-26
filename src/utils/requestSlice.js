import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "request",
  initialState: [],
  reducers: {
    addRequest: (_state, action) => {
      return action.payload;
    },
    removeRequest: (state, action) => {
      return state.filter((req) => req._id !== action.payload);
    },
    clearRequests: () => {
      return [];
    },
  },
});

export const { addRequest, removeRequest, clearRequests } =
  requestSlice.actions;
export default requestSlice.reducer;