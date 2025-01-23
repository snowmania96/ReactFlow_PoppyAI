import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import flowSlice from "./flowSlice";

const appStore = configureStore({
  reducer: {
    flow: flowSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default appStore;
