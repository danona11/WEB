import { configureStore } from "@reduxjs/toolkit";
import UserSlice from './ReduxUserSlice'
import PopupsSlice from './ReduxPopupSlice'

//contains all slices in global object
export const ReduxStore = configureStore({
    
    reducer:{

        user: UserSlice,
        popup: PopupsSlice

    }

})
//type used when using dispatch:
export type RootState = ReturnType<typeof ReduxStore.getState>
export type AppDispatch = typeof ReduxStore.dispatch

