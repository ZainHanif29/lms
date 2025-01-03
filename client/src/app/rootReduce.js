import { authApi } from "@/features/api/authApi";
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/features/userSlice";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  auth: authReducer,
});
export default rootReducer;
