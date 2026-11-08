import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import { useAppDispatch , useAppSelector } from '../Redux/ReduxHooks';
import { closeSnackBar, openSnackBar } from '../Redux/ReduxPopupSlice';
import { Alert } from '@mui/material';


export const SnackBar = () => {

    const dispatch = useAppDispatch()

    const severity  = useAppSelector( (state) => state.popup.SnackBarSeverity )
    const open      = useAppSelector( (state) => state.popup.SnackBarOpen )
    const message   = useAppSelector( (state) => state.popup.SnackBarMessage )

    const handleClose = ( event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason ) => {
       
        if (reason === 'clickaway') return

        dispatch( closeSnackBar() )
    }

    return (
        <Snackbar
            open={ open }
            autoHideDuration={4000} //closes after 4secs
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert onClose={handleClose} severity={ severity } >
                {message}
            </Alert>

        </Snackbar>
    )
}
