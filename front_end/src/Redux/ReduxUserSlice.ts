import { PayloadAction , createSlice } from '@reduxjs/toolkit'
import UserState from '../interfaces/UserStateInterface';
import {GetLocalUserName,GetLocalUserPermissions,RemoveLocalUser,SetLocalUser} from '../utils/handleLocalUser'
//holds all the global users states:
//if user refreshes the ram gets wiped -> store gets inital state

const userName: (string|null) = GetLocalUserName()
const perm    : boolean       = GetLocalUserPermissions()

const initialState: UserState = {
    UserName: userName || "unAuthenticated",
    Permissions: perm,
    LoginPopupOpen: false,
}

export const userSlice = createSlice({
    name: 'user',

    initialState,
    reducers:{  //change the old state by passing the action and the old state into a new object

        setUser:( state, action: PayloadAction<{ userName: string , permissions: boolean }>) => {

            state.UserName = action.payload.userName
            state.Permissions = action.payload.permissions

            SetLocalUser(action.payload.userName , action.payload.permissions )

        },

        clearUser: (state) => { //clear state and local storage when logging out
            
            state.UserName = "unAuthenticated"
            state.Permissions = false
            
            RemoveLocalUser()
        },


        openLoginPopup: (state) => {    //when validate returns unauthorized - popup the login request
            state.LoginPopupOpen = true
        },

        closeLoginPopup: (state) => {
            state.LoginPopupOpen = false
        },
        

    }
})

export const { setUser, clearUser, openLoginPopup , closeLoginPopup } = userSlice.actions;
export default userSlice.reducer;
