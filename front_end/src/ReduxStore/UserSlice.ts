import { PayloadAction , createSlice } from '@reduxjs/toolkit'
//holds all the global users states:

interface UsersState{
  UserName: string   
	Permissions: boolean
  Authenticated: boolean
}

const savedUserName = localStorage.getItem("localUserName");
const savedPermissions = localStorage.getItem("localUserPermissions");


const initialState: UsersState = {
  UserName: savedUserName || "unAuthenticated",
  Permissions: savedPermissions !== "false",
  Authenticated: savedUserName !== "unAuthenticated" && savedUserName !== null  //when user dosnt have a name or it is unAuthenticated it will be false
}

export const userSlice = createSlice({
  name: 'user',

  initialState,

  reducers:{
    //when using dispach updates the state and the local storage: 
    setUser:(state, action: PayloadAction<{ userName: string; permissions: boolean }>) => {
            
      state.UserName = action.payload.userName
      state.Permissions = action.payload.permissions
      state.Authenticated = true

      localStorage.setItem("localUserName", action.payload.userName )
      localStorage.setItem("localUserPermissions", String(action.payload.permissions) )
    },
      
    clearUser: (state) => { //clear state and local storage when logging out
      state.UserName = "unAuthenticated"
      state.Permissions = false
      state.Authenticated = false

      localStorage.removeItem("localUserName");
      localStorage.removeItem("localUserPermissions");
    }
  }
})

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
