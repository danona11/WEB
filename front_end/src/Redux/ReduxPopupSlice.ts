import { PayloadAction , createSlice } from '@reduxjs/toolkit'
import PopupsState from '../interfaces/PopupsState';
import {GetLocalUserName,GetLocalUserPermissions,RemoveLocalUser,SetLocalUser} from '../utils/handleLocalUser'
//holds all the global users states:
//if user refreshes the ram gets wiped -> store gets inital state

const initialState: PopupsState = {
    LoginPopupOpen: false ,
    SnackBarOpen: false ,
    SnackBarSeverity: 'messageError' ,
    SnackBarMessage: 'set snackbar message' ,
}

export const popupsSlice = createSlice({
    name: 'popup',

    initialState,

    reducers:{  //change the old state by passing the action and the old state into a new object

        openLoginPopup: (state) => {    //when validate returns unauthorized - popup the login request
            state.LoginPopupOpen = true
        },

        closeLoginPopup: (state) => {
            state.LoginPopupOpen = false
        },
        
        openSnackBar: (state , action: PayloadAction<{ message: string , severity: "messageError" | "messageSuccess" }>) => {
            
            state.SnackBarOpen = true
            state.SnackBarMessage = action.payload.message
            state.SnackBarSeverity = action.payload.severity

        },

        closeSnackBar: ( state ) => {

            state.SnackBarOpen = false

        }
    }
})

export const { openLoginPopup , closeLoginPopup , openSnackBar , closeSnackBar } = popupsSlice.actions;
export default popupsSlice.reducer;