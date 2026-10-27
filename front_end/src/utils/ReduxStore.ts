import { configureStore } from '@reduxjs/toolkit'
//holds all the global users states:

interface UsersState{
  UserName: string   
	Permissions: boolean
  LogedIn: boolean
}

const initialUserName = localStorage.getItem("userName") || "guest";

const initialState: UsersState = {
  UserName: "unAuthorized",
  Permissions: false,
  LogedIn: false
}


export const ReduxStore = configureStore({
  reducer: {}
})

export type RootState = ReturnType<typeof ReduxStore.getState>
export type AppDispatch = typeof ReduxStore.dispatch
export type AppStore = typeof ReduxStore

