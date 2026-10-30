import { configureStore } from "@reduxjs/toolkit";
import UserSlice from './ReduxUserSlice'

//contains all slices in global object
export const ReduxStore = configureStore({
    
    reducer:{
        
        user: UserSlice,
    
    }

})
//type used when using dispatch:
export type RootState = ReturnType<typeof ReduxStore.getState>
export type AppDispatch = typeof ReduxStore.dispatch

