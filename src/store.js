import { configureStore } from "@reduxjs/toolkit";
import pollReducer from "./store/pollSlice"

export const store = configureStore({
    reducer:{
        poll:pollReducer
    }
})
