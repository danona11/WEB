import { PayloadAction , createSlice } from '@reduxjs/toolkit'
import UserState from '../interfaces/UserStateInterface';
import {GetLocalUserName,GetLocalUserPermissions,RemoveLocalUser,SetLocalUser} from '../utils/handleLocalUser'
//holds all the global users states:
//if user refreshes the ram gets wiped -> store gets inital state

const userName: (string|null) = GetLocalUserName()
const perm    : boolean       = GetLocalUserPermissions()

const initialState: UserState = {
    SliceUserName: userName || "unAuthenticated",
    Permissions: perm,
}

export const userSlice = createSlice({
    name: 'user',

    initialState,
    reducers:{  //change the old state by passing the action and the old state into a new object

        setUser:( state, action: PayloadAction<{ userName: string , permissions: boolean }>) => {
            const { userName , permissions } = action.payload
            
            state.SliceUserName = userName
            state.Permissions = permissions

            SetLocalUser(userName , permissions )

        },

        clearUser: (state) => { //clear state and local storage when logging out
            
            state.SliceUserName = "unAuthenticated"
            state.Permissions = false
            
            RemoveLocalUser()
        },

    }
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
