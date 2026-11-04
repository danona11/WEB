export default interface PopupsState{
    LoginPopupOpen: boolean
    SnackBarOpen: boolean
    SnackBarSeverity: "messageError" | "messageSuccess"
    SnackBarMessage: string 
}