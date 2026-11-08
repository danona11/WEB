export default interface PopupsState{
    LoginPopupOpen: boolean
    SnackBarOpen: boolean
    SnackBarSeverity: "error" | "success" | "info" | "warning"
    SnackBarMessage: string
}