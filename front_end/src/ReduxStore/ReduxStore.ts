import { configureStore } from "@reduxjs/toolkit";
import UserSlice from './UserSlice'

export const ReduxStore = configureStore({
    reducer:{
        user: UserSlice,
    }

})

export type RootState = ReturnType<typeof ReduxStore.getState>
export type AppDispatch = typeof ReduxStore.dispatch

