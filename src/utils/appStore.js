import { configureStore } from "@reduxjs/toolkit";
import flowSlice from "./flowSlice";

const appStore = configureStore({
  reducer: {
    flow: flowSlice,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default appStore;
