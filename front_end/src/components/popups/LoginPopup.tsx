import { FormEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/ReduxHooks";
import { setUser , clearUser } from "../../Redux/ReduxUserSlice";
import { openSnackBar , openLoginPopup , closeLoginPopup } from "../../Redux/ReduxPopupSlice";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import DebouncedTextField from "../DebouncedTextField";
import { useNavigate } from "react-router-dom";


export default function LoginPopup(){

    const [userName , setUserName] = useState<string>("")
    const [password , setPassword] = useState<string>("")

    const dispatch = useAppDispatch();

//the state of LoginPopupOpen userSlice will chnage to true when the user fetches unauthorizred
//the whole component will reRun when openPopup value chnges and then the dialog ui will show
    const loginPopupOpen = useAppSelector( (state) => state.popup.LoginPopupOpen )

    const nav = useNavigate()

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
            
        e.preventDefault();     //the page wont refresh when pressing login
        
        try{    
            const responce = await fetch( `${import.meta.env.VITE_API_URL}/login`,{
                method: "POST" , 
                
                headers: { "Content-Type" : "application/json"}, 
                
                body: JSON.stringify({
                    UserName: userName,
                    Password: password
                }),

                credentials: "include"
            })
            
            const data = await responce.json()  //login controller sends a json with username and permissions

            if (responce.ok) {  //authorized user
                dispatch( setUser({ userName: data.user.UserName , permissions: data.user.Permissions }) ) 
                dispatch(closeLoginPopup())

                setUserName("")  //clear the input fields for next time the popup opens
                setPassword("")
            }

            else{
                console.log('invalid username or password');
            }               
        }
        
        catch(error){
            console.error("network error", error);
        }
    }

    //in case the user can't login - exit to login page
    const cantLogin = () => {

        dispatch( clearUser() )

        dispatch(closeLoginPopup())// Closes the popup

        nav('/login')
    }

    return (   
        <Dialog 
            open={ loginPopupOpen } 
            onClose={ (event,reason) => { if(reason === 'backdropClick' || reason === 'escapeKeyDown') return }}    //closing the popup through pressing outside it or pressing esc wont close the popup(onclose(return))
            aria-labelledby="login-dialog-title"
            aria-describedby="login-dialog-description"
            maxWidth='xs'
        >
            
            <DialogTitle id="login-dialog-title">token expired - confirm user</DialogTitle>
            <form className="login-page" onSubmit={handleLogin} style= {{maxWidth: '400px', maxHeight:'300px' ,margin: '0 auto', padding: '20px' , textAlign: 'center'}}>
                <DialogContent>
                                            
                        <DebouncedTextField 
                            label="user name:"
                            type="text"
                            setValue={setUserName}
                        />
            
                        <DebouncedTextField 
                            label="password:"
                            type="password"
                            setValue={setPassword}
                        />

                </DialogContent>        

                <DialogActions sx={{ justifyContent:'space-between'}}> 
                    <Button onClick={cantLogin} color="error">
                        can't log-in: log-out
                    </Button>

                    <Button type="submit" variant="contained">
                        log-in
                    </Button>
        
                </DialogActions>

            </form>

        </Dialog>

    );
}
